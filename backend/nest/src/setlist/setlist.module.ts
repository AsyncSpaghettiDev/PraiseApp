import { Module } from '@nestjs/common'
import { SetlistController } from './setlist.controller'
import { SetlistService } from './setlist.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Setlist, SetlistSong } from '../entities'
import { SongModule } from '../song/song.module'

@Module({
  imports: [TypeOrmModule.forFeature([Setlist, SetlistSong]), SongModule],
  controllers: [SetlistController],
  exports: [SetlistService],
  providers: [SetlistService]
})
export class SetlistModule {}
