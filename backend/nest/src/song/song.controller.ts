import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common'
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

  @Get(':id')
  getOne(@Param() songId: SongUpdateId) {
    return this.songService.findOne(parseInt(songId.id))
  }

  @Get('searchByLyrics')
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

  @Delete('archive/:id')
  archive(@Param() songId: SongUpdateId) {
    return this.songService.delete(parseInt(songId.id))
  }

  @Delete('remove/:id')
  delete(@Param() songId: SongUpdateId) {
    return this.songService.delete(parseInt(songId.id), true)
  }
}
