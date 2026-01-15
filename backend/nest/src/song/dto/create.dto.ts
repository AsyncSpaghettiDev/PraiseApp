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

export class CreateSongTempo {
  @IsString()
  @IsNotEmpty()
  variant: string

  @IsNumber()
  @IsNotEmpty()
  tempo: number

  @IsString()
  @IsNotEmpty()
  signature: string
}

export class CreateSongKey {
  @IsString()
  @IsNotEmpty()
  variant: string

  @IsString()
  @IsNotEmpty()
  key: string
}

export class CreateSongLyrics {
  @IsString()
  @IsNotEmpty()
  variant: string

  @IsString()
  @IsJSON()
  @IsNotEmpty()
  lyrics: string
}

export class CreateSongStructure {
  @IsString()
  @IsNotEmpty()
  variant: string

  @IsString()
  @IsJSON()
  @IsNotEmpty()
  structure: string
}

export class CreateSongDTO {
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
  @IsString({ each: true })
  tags: string[]

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSongTempo)
  tempo: CreateSongTempo[]

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSongKey)
  key: CreateSongKey[]

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSongLyrics)
  lyrics: CreateSongLyrics[]

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSongStructure)
  structure: CreateSongStructure[]
}
