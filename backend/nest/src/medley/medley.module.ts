import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  Medley,
  MedleyKey,
  MedleyLyrics,
  MedleyStructure,
  MedleyTempo
} from '../entities'
import { MedleyService } from './medley.service'
import { MedleyController } from './medley.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medley,
      MedleyKey,
      MedleyLyrics,
      MedleyStructure,
      MedleyTempo
    ])
  ],
  exports: [MedleyService],
  controllers: [MedleyController],
  providers: [MedleyService]
})
export class MedleyModule {}
