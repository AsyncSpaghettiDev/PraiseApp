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
import { SetlistService } from './setlist.service'
import { CreateSetlistDTO, SetlistId, UpdateSetlistDTO } from './setlist.dto'

@Controller('setlist')
export class SetlistController {
  constructor(private readonly setlistService: SetlistService) {}

  @Get()
  getAll() {
    return this.setlistService.listAll()
  }

  @Get('tags')
  searchByTag(@Query('tag') tag: string) {
    if (tag === '') return []
    return this.setlistService.searchByTag(tag) ?? []
  }

  @Get(':id')
  getOne(@Param() setlistId: SetlistId) {
    return this.setlistService.findOne(setlistId.id)
  }

  @Get('song/:id')
  getSongAppearances(@Param() songId: SetlistId) {
    return this.setlistService.songAppearances(songId.id)
  }

  @Post()
  create(@Body() req: CreateSetlistDTO) {
    return this.setlistService.create(req)
  }

  @Put(':id')
  update(@Param() setlist: SetlistId, @Body() req: UpdateSetlistDTO) {
    return this.setlistService.update(setlist.id, req)
  }

  @Delete('archive/:id')
  archive(@Param() setlist: SetlistId): Promise<unknown> {
    return this.setlistService.delete(setlist.id)
  }

  @Delete('remove/:id')
  delete(@Param() setlist: SetlistId): Promise<unknown> {
    return this.setlistService.delete(setlist.id, true)
  }
}
