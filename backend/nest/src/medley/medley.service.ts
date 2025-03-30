import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, ILike, Repository } from 'typeorm'
import {
  Medley,
  MedleyKey,
  MedleyLyrics,
  MedleyStructure,
  MedleyTempo
} from '../entities'
import { CreateMedleyDTO } from './dto/create.dto'
import { UpdateMedleyDTO } from './dto/update.dto'

@Injectable()
export class MedleyService {
  constructor(
    @InjectRepository(MedleyKey)
    private medleyKeyRepository: Repository<MedleyKey>,
    @InjectRepository(MedleyLyrics)
    private medleyLyricsRepository: Repository<MedleyLyrics>,
    @InjectRepository(MedleyStructure)
    private medleyStructureRepository: Repository<MedleyStructure>,
    @InjectRepository(MedleyTempo)
    private medleyTempoRepository: Repository<MedleyTempo>,
    @InjectRepository(Medley) private medleysRepository: Repository<Medley>,
    private dataSource: DataSource
  ) {}

  async listAll(): Promise<Medley[]> {
    return await this.medleysRepository.find({
      relations: {
        lyrics: true,
        key: true,
        tempo: true,
        structure: true,
        songs: true
      }
    })
  }

  async findOne(medleyId: number): Promise<Medley> {
    const medley = await this.medleysRepository.findOne({
      withDeleted: true,
      relations: {
        lyrics: true,
        key: true,
        tempo: true,
        structure: true,
        songs: true
      },
      where: {
        id: medleyId
      }
    })
    if (!medley)
      throw new HttpException('Medley not found', HttpStatus.NOT_FOUND)
    return medley
  }

  async findByLyrics(lyricsToSearch: string) {
    return await this.medleyLyricsRepository.find({
      relations: {
        medley: true
      },
      where: {
        normalizedLyrics: ILike(`%${lyricsToSearch}%`)
      }
    })
  }

  async create(createMedleyDTO: CreateMedleyDTO): Promise<Medley> {
    const { artist, key, lyrics, name, structure, style, tempo, songs } =
      createMedleyDTO

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const createdMedley = await queryRunner.manager.save(
        this.medleysRepository.create({
          artist,
          name,
          style,
          songs
        })
      )
      if (key.length > 0)
        for (const keyObj of key)
          await queryRunner.manager.save(
            this.medleyKeyRepository.create({
              ...keyObj,
              medley: createdMedley
            })
          )
      if (lyrics.length > 0)
        for (const lyricsObj of lyrics)
          await queryRunner.manager.save(
            this.medleyLyricsRepository.create({
              variant: lyricsObj.variant,
              lyrics: lyricsObj.lyrics,
              normalizedLyrics: lyricsObj.lyrics
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, ''),
              medley: createdMedley
            })
          )
      if (structure.length > 0)
        for (const structureObj of structure)
          await queryRunner.manager.save(
            this.medleyStructureRepository.create({
              ...structureObj,
              medley: createdMedley
            })
          )
      if (tempo.length > 0)
        for (const tempoObj of tempo)
          await queryRunner.manager.save(
            this.medleyTempoRepository.create({
              ...tempoObj,
              medley: createdMedley
            })
          )

      await queryRunner.commitTransaction()

      return createdMedley
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err)
      await queryRunner.rollbackTransaction()
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release()
    }
  }

  async update(
    MedleyId: number,
    updateMedleyDTO: UpdateMedleyDTO
  ): Promise<Medley> {
    const { artist, key, lyrics, name, structure, style, tempo } =
      updateMedleyDTO

    const MedleyToUpdate = await this.medleysRepository.findOne({
      where: { id: MedleyId }
    })
    if (!MedleyToUpdate)
      throw new HttpException('Medley not found', HttpStatus.NOT_FOUND)

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      if (artist) MedleyToUpdate.artist = artist
      if (name) MedleyToUpdate.name = name
      if (style) MedleyToUpdate.style = style
      const updatedMedley = await queryRunner.manager.save(MedleyToUpdate)

      if (key && key.length > 0) {
        for (const keyObj of key)
          await queryRunner.manager.update(MedleyKey, keyObj.id, {
            ...keyObj,
            medley: updatedMedley
          })
      }
      if (lyrics && lyrics.length > 0) {
        for (const lyricsObj of lyrics)
          await queryRunner.manager.update(MedleyLyrics, lyricsObj.id, {
            variant: lyricsObj.variant,
            lyrics: lyricsObj.lyrics,
            normalizedLyrics: lyricsObj.lyrics
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
            medley: updatedMedley
          })
      }
      if (structure && structure.length > 0) {
        for (const structureObj of structure)
          await queryRunner.manager.update(MedleyStructure, structureObj.id, {
            ...structureObj,
            medley: updatedMedley
          })
      }
      if (tempo && tempo.length > 0) {
        for (const tempoObj of tempo)
          await queryRunner.manager.update(MedleyTempo, tempoObj.id, {
            ...tempoObj,
            medley: updatedMedley
          })
      }

      await queryRunner.commitTransaction()
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err)
      await queryRunner.rollbackTransaction()
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release()
    }
    return this.medleysRepository.findOne({
      relations: { lyrics: true, key: true, tempo: true, structure: true },
      where: { id: MedleyId }
    })
  }

  async delete(MedleyId: number, hardDelete: boolean = false) {
    return hardDelete
      ? this.medleysRepository.delete(MedleyId)
      : this.medleysRepository.softDelete(MedleyId)
  }
}
