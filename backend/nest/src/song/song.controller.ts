import { Body, Controller, Get, Post } from '@nestjs/common'
import { SongService } from './song.service'
import { CreateSongDTO } from './song.dto'

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get('list')
  list() {
    return this.songService.findAll()
  }

  @Post()
  create(@Body() req: CreateSongDTO) {
    return this.songService.newSong(req)
  }
}
