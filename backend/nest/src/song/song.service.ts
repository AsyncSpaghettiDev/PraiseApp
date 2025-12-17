import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import {
  Song,
  SongDocument,
  SongKey,
  SongLyrics,
  SongStructure,
  SongTempo
} from '../schemas/song.schema'
import { CreateSongDTO } from './dto/create.dto'
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

      if (key && key.length > 0) {
        for (const keyObj of key) {
          const subdoc = (songToUpdate.key as unknown as SongKey[]).find(
            (k) => k?._id?.toString?.() === keyObj.id
          )
          if (subdoc) {
            subdoc.variant = keyObj.variant
            subdoc.key = keyObj.key
          }
        }
      }
      if (lyrics && lyrics.length > 0) {
        for (const lyricsObj of lyrics) {
          const subdoc = (songToUpdate.lyrics as unknown as SongLyrics[]).find(
            (l) => l?._id?.toString?.() === lyricsObj.id
          )
          if (subdoc) {
            subdoc.variant = lyricsObj.variant
            subdoc.lyrics = lyricsObj.lyrics
          }
        }
      }
      if (structure && structure.length > 0) {
        for (const structureObj of structure) {
          const subdoc = (
            songToUpdate.structure as unknown as SongStructure[]
          ).find((st) => st?._id?.toString?.() === structureObj.id)
          if (subdoc) {
            subdoc.variant = structureObj.variant
            subdoc.structure = structureObj.structure
          }
        }
      }
      if (tempo && tempo.length > 0) {
        for (const tempoObj of tempo) {
          const subdoc = (songToUpdate.tempo as unknown as SongTempo[]).find(
            (t) => t?._id?.toString?.() === tempoObj.id
          )
          if (subdoc) {
            subdoc.variant = tempoObj.variant
            subdoc.tempo = tempoObj.tempo
          }
        }
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
