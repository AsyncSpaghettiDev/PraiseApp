import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { SetlistService } from './setlist.service'
import { CreateSetlistDTO, SetlistId, UpdateSetlistDTO } from './setlist.dto'

@Controller('setlist')
export class SetlistController {
  constructor(private readonly setlistService: SetlistService) {}

  @Get('list')
  getAll() {
    return this.setlistService.listAll()
  }

  @Get(':id')
  getOne(@Param() setlistId: SetlistId) {
    return this.setlistService.findOne(parseInt(setlistId.id))
  }

  @Get('song/:id')
  getSongAppearances(@Param() songId: SetlistId) {
    return this.setlistService.songAppearances(parseInt(songId.id))
  }

  @Post()
  create(@Body() req: CreateSetlistDTO) {
    return this.setlistService.create(req)
  }

  @Put(':id')
  update(@Param() setlist: SetlistId, @Body() req: UpdateSetlistDTO) {
    return this.setlistService.update(parseInt(setlist.id), req)
  }

  @Delete('archive/:id')
  archive(@Param() setlist: SetlistId) {
    return this.setlistService.delete(parseInt(setlist.id))
  }

  @Delete('remove/:id')
  delete(@Param() setlist: SetlistId) {
    return this.setlistService.delete(parseInt(setlist.id), true)
  }
}
