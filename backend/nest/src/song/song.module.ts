import { Module } from '@nestjs/common'
import { SongController } from './song.controller'
import { SongService } from './song.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  Song,
  SongKey,
  SongLyrics,
  SongStructure,
  SongTempo
} from '../entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Song,
      SongKey,
      SongLyrics,
      SongStructure,
      SongTempo
    ])
  ],
  exports: [SongService],
  controllers: [SongController],
  providers: [SongService]
})
export class SongModule {}
