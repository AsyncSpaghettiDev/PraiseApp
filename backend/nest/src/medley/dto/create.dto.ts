import { Type } from 'class-transformer'
import {
  IsIn,
  ValidateNested,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsJSON,
  IsArray
} from 'class-validator'

export class CreateMedleyTempo {
  @IsString()
  @IsNotEmpty()
  variant: string

  @IsNumber()
  @IsNotEmpty()
  tempo: number
}

export class CreateMedleyKey {
  @IsString()
  @IsNotEmpty()
  variant: string

  @IsString()
  @IsNotEmpty()
  key: string
}

export class CreateMedleyLyrics {
  @IsString()
  @IsNotEmpty()
  variant: string

  @IsString()
  @IsJSON()
  @IsNotEmpty()
  lyrics: string
}

export class CreateMedleyStructure {
  @IsString()
  @IsNotEmpty()
  variant: string

  @IsString()
  @IsNotEmpty()
  @IsJSON()
  structure: string
}

export class MedleySong {
  id: number
}

export class CreateMedleyDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsIn(['praise', 'worship'])
  @IsNotEmpty()
  style: 'praise' | 'worship'

  @IsString()
  @IsNotEmpty()
  artist: string

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMedleyTempo)
  tempo: CreateMedleyTempo[]

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMedleyKey)
  key: CreateMedleyKey[]

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMedleyLyrics)
  lyrics: CreateMedleyLyrics[]

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMedleyStructure)
  structure: CreateMedleyStructure[]

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedleySong)
  songs: MedleySong[]
}
