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
import type {
  SongTempo,
  SongKey,
  SongLyrics,
  SongStructure,
  CreateSongRequest
} from '@praise-app/types'

export class CreateSongTempo implements SongTempo {
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

export class CreateSongKey implements SongKey {
  @IsString()
  @IsNotEmpty()
  variant: string

  @IsString()
  @IsNotEmpty()
  key: string
}

export class CreateSongLyrics implements SongLyrics {
  @IsString()
  @IsNotEmpty()
  variant: string

  @IsString()
  @IsJSON()
  @IsNotEmpty()
  lyrics: string
}

export class CreateSongStructure implements SongStructure {
  @IsString()
  @IsNotEmpty()
  variant: string

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  structure: string[]
}

export class CreateSongDTO implements CreateSongRequest {
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
