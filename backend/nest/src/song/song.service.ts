import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Song } from '../entities'
import { CreateSongDTO } from './song.dto'

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song) private songsRepository: Repository<Song>
  ) {}

  async findAll(): Promise<Song[]> {
    return await this.songsRepository.find({
      loadEagerRelations: true,
      relations: { lyrics: true, key: true, tempo: true, structure: true }
    })
  }

  // async create(createSongDTO: CreateSongDTO): Promise<Song> {
  async newSong(createSongDTO: CreateSongDTO): Promise<object> {
    const { artist, key, lyrics, name, structure, style, tempo } = createSongDTO
    const createdSong = await this.songsRepository.save({
      artist,
      key,
      lyrics,
      name,
      structure,
      style,
      tempo
    })
    return {
      message: 'Song create successfully',
      song: createdSong
    }
    // return await this.songsRepository.save(createSongDTO)
  }
}
