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
import { MedleyService } from './medley.service'
import { CreateMedleyDTO } from './dto/create.dto'
import { MedleyUpdateId, UpdateMedleyDTO } from './dto/update.dto'

@Controller('medley')
export class MedleyController {
  constructor(private readonly medleyService: MedleyService) {}

  @Get('list')
  list() {
    return this.medleyService.listAll()
  }

  @Get(':id')
  getOne(@Param() songId: MedleyUpdateId) {
    return this.medleyService.findOne(parseInt(songId.id))
  }

  @Get('searchByLyrics')
  findByLyrics(@Query('q') q: string) {
    return this.medleyService.findByLyrics(q)
  }

  @Post()
  create(@Body() req: CreateMedleyDTO) {
    return this.medleyService.create(req)
  }

  @Put(':id')
  update(@Param() songId: MedleyUpdateId, @Body() req: UpdateMedleyDTO) {
    return this.medleyService.update(parseInt(songId.id), req)
  }

  @Delete('archive/:id')
  archive(@Param() songId: MedleyUpdateId) {
    return this.medleyService.delete(parseInt(songId.id))
  }

  @Delete('remove/:id')
  delete(@Param() songId: MedleyUpdateId) {
    return this.medleyService.delete(parseInt(songId.id), true)
  }
}
