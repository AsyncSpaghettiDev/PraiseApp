import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, ILike, Repository } from 'typeorm'
import {
  Song,
  SongKey,
  SongLyrics,
  SongStructure,
  SongTempo
} from '../entities'
import { CreateSongDTO } from './dto/create.dto'
import { UpdateSongDTO } from './dto/update.dto'

export interface SongMetadataIds {
  tempoId: number
  keyId: number
  lyricsId: number
  structureId: number
}

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(SongKey) private songKeyRepository: Repository<SongKey>,
    @InjectRepository(SongLyrics)
    private songLyricsRepository: Repository<SongLyrics>,
    @InjectRepository(SongStructure)
    private songStructureRepository: Repository<SongStructure>,
    @InjectRepository(SongTempo)
    private songTempoRepository: Repository<SongTempo>,
    @InjectRepository(Song) private songsRepository: Repository<Song>,
    private dataSource: DataSource
  ) {}

  async listAll(): Promise<Song[]> {
    return await this.songsRepository.find({
      relations: { lyrics: true, key: true, tempo: true, structure: true }
    })
  }

  async findOne(songId: number): Promise<Song> {
    const song = await this.songsRepository.findOne({
      withDeleted: true,
      relations: { lyrics: true, key: true, tempo: true, structure: true },
      where: {
        id: songId
      }
    })
    if (!song) throw new HttpException('Song not found', HttpStatus.NOT_FOUND)
    return song
  }

  async findByLyrics(lyricsToSearch: string) {
    return await this.songLyricsRepository.find({
      relations: {
        song: true
      },
      where: {
        normalizedLyrics: ILike(`%${lyricsToSearch}%`)
      }
    })
  }

  async create(createSongDTO: CreateSongDTO): Promise<Song> {
    const { artist, key, lyrics, name, structure, style, tempo } = createSongDTO

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const createdSong = await queryRunner.manager.save(
        this.songsRepository.create({
          artist,
          name,
          style
        })
      )
      if (key.length > 0)
        for (const keyObj of key)
          await queryRunner.manager.save(
            this.songKeyRepository.create({ ...keyObj, song: createdSong })
          )
      if (lyrics.length > 0)
        for (const lyricsObj of lyrics)
          await queryRunner.manager.save(
            this.songLyricsRepository.create({
              variant: lyricsObj.variant,
              lyrics: lyricsObj.lyrics,
              normalizedLyrics: lyricsObj.lyrics
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, ''),
              song: createdSong
            })
          )
      if (structure.length > 0)
        for (const structureObj of structure)
          await queryRunner.manager.save(
            this.songStructureRepository.create({
              ...structureObj,
              song: createdSong
            })
          )
      if (tempo.length > 0)
        for (const tempoObj of tempo)
          await queryRunner.manager.save(
            this.songTempoRepository.create({ ...tempoObj, song: createdSong })
          )

      await queryRunner.commitTransaction()

      return createdSong
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err)
      await queryRunner.rollbackTransaction()
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release()
    }
  }

  async update(songId: number, updateSongDTO: UpdateSongDTO): Promise<Song> {
    const { artist, key, lyrics, name, structure, style, tempo } = updateSongDTO

    const songToUpdate = await this.songsRepository.findOne({
      where: { id: songId }
    })
    if (!songToUpdate)
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND)

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      if (artist) songToUpdate.artist = artist
      if (name) songToUpdate.name = name
      if (style) songToUpdate.style = style
      const updatedSong = await queryRunner.manager.save(songToUpdate)

      if (key && key.length > 0) {
        for (const keyObj of key)
          await queryRunner.manager.update(SongKey, keyObj.id, {
            ...keyObj,
            song: updatedSong
          })
      }
      if (lyrics && lyrics.length > 0) {
        for (const lyricsObj of lyrics)
          await queryRunner.manager.update(SongLyrics, lyricsObj.id, {
            variant: lyricsObj.variant,
            lyrics: lyricsObj.lyrics,
            normalizedLyrics: lyricsObj.lyrics
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
            song: updatedSong
          })
      }
      if (structure && structure.length > 0) {
        for (const structureObj of structure)
          await queryRunner.manager.update(SongStructure, structureObj.id, {
            ...structureObj,
            song: updatedSong
          })
      }
      if (tempo && tempo.length > 0) {
        for (const tempoObj of tempo)
          await queryRunner.manager.update(SongTempo, tempoObj.id, {
            ...tempoObj,
            song: updatedSong
          })
      }

      await queryRunner.commitTransaction()
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err)
      await queryRunner.rollbackTransaction()
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release()
    }
    return this.songsRepository.findOne({
      relations: { lyrics: true, key: true, tempo: true, structure: true },
      where: { id: songId }
    })
  }

  async delete(songId: number, hardDelete: boolean = false) {
    return hardDelete
      ? this.songsRepository.delete(songId)
      : this.songsRepository.softDelete(songId)
  }

  async validateMetadata(
    songId: number,
    { keyId, lyricsId, structureId, tempoId }: SongMetadataIds
  ): Promise<boolean> {
    const song = await this.findOne(songId)
    if (
      song.key.some((sk) => sk.id === keyId) &&
      song.lyrics.some((sl) => sl.id === lyricsId) &&
      song.structure.some((ss) => ss.id === structureId) &&
      song.tempo.some((st) => st.id === tempoId)
    ) {
      return true
    }
    throw new HttpException(
      `The given ids for the song id ${songId} are not valid`,
      HttpStatus.BAD_REQUEST
    )
  }
}
