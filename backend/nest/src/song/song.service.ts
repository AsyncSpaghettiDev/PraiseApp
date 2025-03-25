import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, ILike, Repository } from 'typeorm'
import {
  Song,
  SongKey,
  SongLyrics,
  SongStructure,
  SongTempo
} from '../entities'
import { CreateSongDTO } from './song.dto'

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

  async findAll(): Promise<Song[]> {
    return await this.songsRepository.find({
      loadEagerRelations: true,
      relations: { lyrics: true, key: true, tempo: true, structure: true }
    })
  }

  async findByLyrics(lyricsToSearch: string) {
    return await this.songLyricsRepository.find({
      relations: {
        song: true
      },
      where: {
        lyrics: ILike(lyricsToSearch)
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
      await queryRunner.manager.save(
        this.songKeyRepository.create({ ...key, song: createdSong })
      )
      await queryRunner.manager.save(
        this.songLyricsRepository.create({ ...lyrics, song: createdSong })
      )
      await queryRunner.manager.save(
        this.songStructureRepository.create({ ...structure, song: createdSong })
      )
      await queryRunner.manager.save(
        this.songTempoRepository.create({ ...tempo, song: createdSong })
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
}
