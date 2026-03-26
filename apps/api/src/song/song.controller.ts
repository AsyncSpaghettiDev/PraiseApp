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
import { ScrapeSongDTO } from './dto/scrape.dto'
import { SongUpdateId, UpdateSongDTO } from './dto/update.dto'

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  list() {
    return this.songService.listAll()
  }

  @Get('tags')
  searchByTag(@Query('tag') tag: string) {
    if (!tag || tag === '') return []
    return this.songService.searchByTag(tag) ?? []
  }

  @Get('searchByLyrics')
  findByLyrics(@Query('q') q: string) {
    return this.songService.findByLyrics(q)
  }

  @Get(':id')
  getOne(@Param() songId: SongUpdateId) {
    return this.songService.findOne(songId.id)
  }

  @Post()
  create(@Body() req: CreateSongDTO) {
    return this.songService.create(req)
  }

  @Post('scrape')
  async scrape(@Body() req: ScrapeSongDTO) {
    const results = await this.songService.scrapeSongBpm(req.query)
    return { results }
  }

  @Put(':id')
  update(@Param() songId: SongUpdateId, @Body() req: UpdateSongDTO) {
    console.log(songId)
    return this.songService.update(songId.id, req)
  }

  @Delete('archive/:id')
  archive(@Param() songId: SongUpdateId): Promise<unknown> {
    return this.songService.delete(songId.id)
  }

  @Delete('remove/:id')
  delete(@Param() songId: SongUpdateId): Promise<unknown> {
    return this.songService.delete(songId.id, true)
  }
}
