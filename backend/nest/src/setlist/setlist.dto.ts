import { Type } from 'class-transformer'
import {
  IsArray,
  IsDateString,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  ValidateNested
} from 'class-validator'

export class CreateSetlistSongDTO {
  @IsNotEmpty()
  @IsNumber()
  songId: number

  @IsNotEmpty()
  @IsNumber()
  tempoId: number

  @IsNotEmpty()
  @IsNumber()
  keyId: number

  @IsNotEmpty()
  @IsNumber()
  lyricsId: number

  @IsNotEmpty()
  @IsNumber()
  structureId: number
}

export class SetlistId {
  @IsNotEmpty()
  @IsNumberString()
  id: string
}

export class CreateSetlistDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsJSON()
  tags: string

  @IsNotEmpty()
  @IsDateString()
  date: Date

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSetlistSongDTO)
  songs: CreateSetlistSongDTO[]
}

export class UpdateSetlistSongDTO extends CreateSetlistSongDTO {
  @IsNotEmpty()
  @IsNumberString()
  id: string
}

export class UpdateSetlistDTO extends CreateSetlistDTO {
  @IsNotEmpty()
  @IsNumberString()
  id: number

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSetlistSongDTO)
  songs: UpdateSetlistSongDTO[]
}
