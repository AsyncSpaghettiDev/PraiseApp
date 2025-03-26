import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { SongService } from './song.service'
import { CreateSongDTO } from './dto/create.dto'
import { SongUpdateId, UpdateSongDTO } from './dto/update.dto'

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get('list')
  list() {
    return this.songService.listAll()
  }

  @Get('lyrics')
  findByLyrics(@Query('q') q: string) {
    return this.songService.findByLyrics(q)
  }

  @Post()
  create(@Body() req: CreateSongDTO) {
    return this.songService.create(req)
  }

  @Put(':id')
  update(@Param() songId: SongUpdateId, @Body() req: UpdateSongDTO) {
    return this.songService.update(parseInt(songId.id), req)
  }
}
