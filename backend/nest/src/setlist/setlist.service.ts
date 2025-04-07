import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Setlist, SetlistSong } from '../entities'
import { DataSource, Repository } from 'typeorm'
import { CreateSetlistDTO, UpdateSetlistDTO } from './setlist.dto'
import { SongService } from '../song/song.service'

@Injectable()
export class SetlistService {
  constructor(
    private songService: SongService,
    private dataSource: DataSource,
    @InjectRepository(SetlistSong)
    private setlistSongRepository: Repository<SetlistSong>,
    @InjectRepository(Setlist) private setlistRepository: Repository<Setlist>
  ) {}

  listAll(): Promise<Setlist[]> {
    return this.setlistRepository.find({
      relations: {
        setlistSongs: {
          key: true,
          lyrics: true,
          song: true,
          structure: true,
          tempo: true
        }
      }
    })
  }

  async findOne(setlistId: number): Promise<Setlist> {
    const setlist = this.setlistRepository.findOne({
      where: { id: setlistId },
      relations: {
        setlistSongs: {
          song: true,
          key: true,
          lyrics: true,
          setlist: true,
          structure: true,
          tempo: true
        }
      }
    })
    if (!setlist)
      throw new HttpException('Setlist not found', HttpStatus.NOT_FOUND)
    return setlist
  }

  async songAppearances(songId: number): Promise<object> {
    // Count how many times a specific song appears in setlists
    const count = await this.setlistSongRepository.count({
      where: {
        song: { id: songId }
      }
    })
    const lastSetlistSong = await this.setlistSongRepository
      .createQueryBuilder('setlistSong')
      .leftJoinAndSelect('setlistSong.setlist', 'setlist')
      .where('setlistSong.songId = :songId', { songId })
      .orderBy('setlist.date', 'DESC') // or order by 'setlist.id' if date isn't available
      .getOne()
    return {
      count,
      lastSetlistSong
    }
  }

  async create(createSetlist: CreateSetlistDTO): Promise<Setlist> {
    const { date, name, songs } = createSetlist
    // validate songs
    for (const { songId, keyId, lyricsId, structureId, tempoId } of songs) {
      await this.songService.validateMetadata(songId, {
        keyId,
        lyricsId,
        structureId,
        tempoId
      })
    }
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const newSetlist = await queryRunner.manager.save(
        queryRunner.manager.create(Setlist, {
          name,
          date
        })
      )

      const setlistSongs = queryRunner.manager.create(
        SetlistSong,
        songs.map(({ keyId, lyricsId, songId, structureId, tempoId }) => ({
          setlist: { id: newSetlist.id },
          key: { id: keyId },
          lyrics: { id: lyricsId },
          song: { id: songId },
          structure: { id: structureId },
          tempo: { id: tempoId }
        }))
      )
      await queryRunner.manager.save(setlistSongs)
      await queryRunner.commitTransaction()
      return newSetlist
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err)
      await queryRunner.rollbackTransaction()
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release()
    }
  }

  async update(
    setlistId: number,
    updateSetlist: UpdateSetlistDTO
  ): Promise<Setlist> {
    const { date, name, songs } = updateSetlist
    const setlistToUpdate = await this.findOne(setlistId)
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      setlistToUpdate.date = date
      setlistToUpdate.name = name
      const songsToUpdate = []
      for (const {
        keyId,
        lyricsId,
        songId,
        structureId,
        tempoId,
        id
      } of songs) {
        await this.songService.validateMetadata(songId, {
          keyId,
          lyricsId,
          structureId,
          tempoId
        })
        songsToUpdate.push(
          await queryRunner.manager.update(SetlistSong, id, {
            key: { id: keyId },
            lyrics: { id: lyricsId },
            song: { id: songId },
            structure: { id: structureId },
            tempo: { id: tempoId }
          })
        )
      }
      queryRunner.manager.save(setlistToUpdate)
      await queryRunner.commitTransaction()
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err)
      await queryRunner.rollbackTransaction()
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release()
    }

    return setlistToUpdate
  }

  async delete(setlistId: number, hardDelete: boolean = false) {
    return hardDelete
      ? this.setlistSongRepository.delete(setlistId)
      : this.setlistSongRepository.softDelete(setlistId)
  }
}
