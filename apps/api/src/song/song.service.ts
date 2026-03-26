import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import axios from 'axios'
import * as cheerio from 'cheerio'
import {
  Song,
  SongDocument,
  SongKey,
  SongLyrics,
  SongStructure,
  SongTempo
} from '../schemas/song.schema'
import { CreateSongDTO } from './dto/create.dto'
import type { ScrapeSongResult } from './dto/scrape.dto'
import { UpdateSongDTO } from './dto/update.dto'

export interface SongMetadataIds {
  tempoId: string
  keyId: string
  lyricsId: string
  structureId: string
}

@Injectable()
export class SongService {
  constructor(@InjectModel(Song.name) private songsModel: Model<Song>) {}

  private normalizeKeyValue(keyValue: string): string {
    const normalized = (keyValue ?? '')
      .trim()
      .replaceAll('♭', 'b')
      .replaceAll('♯', '#')
    if (!normalized) return ''

    // Examples observed in the wild: "G", "Bb", "D Minor", "F# Major"
    return normalized.split(/\s+/)[0]
  }

  async scrapeSongBpm(query: string): Promise<ScrapeSongResult[]> {
    const trimmed = (query ?? '').trim()
    if (!trimmed) return []

    const res = await axios.post(
      'https://songbpm.com/searches',
      new URLSearchParams({ query: trimmed }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Origin: 'https://songbpm.com'
        },
        timeout: 15000
      }
    )

    const $ = cheerio.load(res.data)
    const results: ScrapeSongResult[] = []

    $('.bg-card').each((_, el) => {
      const card = $(el)

      const link = card.find('a').first()
      const pTags = link.find('p')
      const artist = pTags.first().text().trim()
      const title = pTags.eq(1).text().trim()

      const getInfo = (label: string) => {
        const labelSpan = card
          .find('span')
          .filter(
            (__, s) => $(s).text().trim().toLowerCase() === label.toLowerCase()
          )
          .first()

        if (!labelSpan || labelSpan.length === 0) return ''

        const valueSpan = labelSpan.next('span')
        if (valueSpan && valueSpan.length) return valueSpan.text().trim()

        const parent = labelSpan.parent()
        const spansInParent = parent.find('span')
        if (spansInParent.length >= 2)
          return $(spansInParent.get(1)).text().trim()

        return ''
      }

      const key = this.normalizeKeyValue(getInfo('Key'))
      const duration = getInfo('Duration')
      const bpm = getInfo('BPM')
      const spotify =
        card.find('a[href*="open.spotify.com"]').attr('href') || ''
      const apple = card.find('a[href*="music.apple.com"]').attr('href') || ''

      if (!title && !artist) return

      results.push({
        title,
        artist,
        key,
        duration,
        bpm,
        links: {
          spotify,
          apple
        }
      })
    })

    return results
  }

  async listAll(): Promise<SongDocument[]> {
    return await this.songsModel.find().exec()
  }

  async findOne(songId: string): Promise<SongDocument> {
    if (!Types.ObjectId.isValid(songId))
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND)

    const song = await this.songsModel.findById(songId).exec()
    if (!song) throw new HttpException('Song not found', HttpStatus.NOT_FOUND)
    return song
  }

  async searchByTag(tag: string): Promise<SongDocument[]> {
    const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return await this.songsModel
      .find({ tags: { $regex: escapedTag, $options: 'i' } })
      .exec()
  }

  async findByLyrics(lyricsToSearch: string) {
    if (!lyricsToSearch || lyricsToSearch.trim() === '') return []

    const diacriticMap: Record<string, string> = {
      a: 'aáàâäãåāăąǎ',
      c: 'cçćč',
      e: 'eéèêëēĕėęě',
      i: 'iíìîïĩīĭįǐ',
      n: 'nñńň',
      o: 'oóòôöõōŏőǒ',
      u: 'uúùûüũūŭůűųǔ',
      y: 'yýÿ'
    }

    const escapeRegexChar = (value: string) =>
      value.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')

    const trimmed = lyricsToSearch.trim()
    let pattern = ''
    for (let i = 0; i < trimmed.length; i++) {
      const ch = trimmed[i]

      if (/\s/.test(ch)) {
        pattern += '\\s+'
        while (i + 1 < trimmed.length && /\s/.test(trimmed[i + 1])) i++
        continue
      }

      const baseChar = ch
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()

      const mapped = diacriticMap[baseChar]
      if (mapped) {
        const uniqueChars = Array.from(
          new Set((mapped + mapped.toUpperCase()).split(''))
        ).join('')
        pattern += `[${uniqueChars}]`
        continue
      }

      pattern += escapeRegexChar(ch)
    }

    return await this.songsModel
      .find({ 'lyrics.lyrics': new RegExp(pattern, 'i') })
      .exec()
  }

  async create(createSongDTO: CreateSongDTO): Promise<SongDocument> {
    const { artist, key, lyrics, name, structure, style, tempo, tags } =
      createSongDTO
    try {
      return await this.songsModel.create({
        artist,
        name,
        tags,
        style,
        tempo,
        key,
        lyrics: lyrics.map((lyricsObj) => ({
          variant: lyricsObj.variant,
          lyrics: lyricsObj.lyrics
        })),
        structure
      })
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err)
      throw err
    }
  }

  async update(
    songId: string,
    updateSongDTO: UpdateSongDTO
  ): Promise<SongDocument> {
    const { artist, key, lyrics, name, structure, style, tempo, tags } =
      updateSongDTO

    const songToUpdate = await this.findOne(songId)
    if (!songToUpdate)
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND)
    try {
      if (artist) songToUpdate.artist = artist
      if (name) songToUpdate.name = name
      if (style) songToUpdate.style = style
      if (tags) songToUpdate.tags = tags

      // Replace entire arrays instead of updating by ID
      if (key && key.length > 0) {
        songToUpdate.key = key as unknown as SongKey[]
      }
      if (lyrics && lyrics.length > 0) {
        songToUpdate.lyrics = lyrics as unknown as SongLyrics[]
      }
      if (structure && structure.length > 0) {
        songToUpdate.structure = structure as unknown as SongStructure[]
      }
      if (tempo && tempo.length > 0) {
        songToUpdate.tempo = tempo as unknown as SongTempo[]
      }

      await songToUpdate.save()
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err)
      throw err
    }
    return this.findOne(songId)
  }

  async delete(songId: string, hardDelete: boolean = false): Promise<unknown> {
    if (!Types.ObjectId.isValid(songId)) return null
    return hardDelete
      ? this.songsModel.deleteOne({ _id: songId }).exec()
      : this.songsModel
          .findByIdAndUpdate(songId, { deletedAt: new Date() }, { new: true })
          .exec()
  }

  async validateMetadata(
    songId: string,
    { keyId, lyricsId, structureId, tempoId }: SongMetadataIds
  ): Promise<boolean> {
    const song = await this.findOne(songId)

    const hasKey = (song.key as unknown as SongKey[]).some(
      (k) => k?._id?.toString?.() === keyId
    )
    const hasLyrics = (song.lyrics as unknown as SongLyrics[]).some(
      (l) => l?._id?.toString?.() === lyricsId
    )
    const hasStructure = (song.structure as unknown as SongStructure[]).some(
      (st) => st?._id?.toString?.() === structureId
    )
    const hasTempo = (song.tempo as unknown as SongTempo[]).some(
      (t) => t?._id?.toString?.() === tempoId
    )

    if (hasKey && hasLyrics && hasStructure && hasTempo) return true
    throw new HttpException(
      `The given ids for the song id ${songId} are not valid`,
      HttpStatus.BAD_REQUEST
    )
  }
}
