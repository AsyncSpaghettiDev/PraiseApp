import { Module } from '@nestjs/common'
import { SetlistController } from './setlist.controller'
import { SetlistService } from './setlist.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Setlist, SetlistSchema } from '../schemas/setlist.schema'
import { Song, SongSchema } from '../schemas/song.schema'
import { SongModule } from '../song/song.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Setlist.name, schema: SetlistSchema },
      { name: Song.name, schema: SongSchema }
    ]),
    SongModule
  ],
  controllers: [SetlistController],
  exports: [SetlistService],
  providers: [SetlistService]
})
export class SetlistModule {}
