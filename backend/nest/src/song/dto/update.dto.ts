import { Type } from 'class-transformer'
import {
  IsIn,
  ValidateNested,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsNumberString
} from 'class-validator'
import {
  CreateSongKey,
  CreateSongLyrics,
  CreateSongStructure,
  CreateSongTempo
} from './create.dto'

export class SongUpdateId {
  @IsNotEmpty()
  @IsNumberString()
  id: string
}

export class UpdateSongTempo extends CreateSongTempo {
  @IsNotEmpty()
  @IsNumber()
  id: number
}

export class UpdateSongKey extends CreateSongKey {
  @IsNotEmpty()
  @IsNumber()
  id: number
}

export class UpdateSongLyrics extends CreateSongLyrics {
  @IsNotEmpty()
  @IsNumber()
  id: number
}

export class UpdateSongStructure extends CreateSongStructure {
  @IsNotEmpty()
  @IsNumber()
  id: number
}

export class UpdateSongDTO {
  @IsString()
  name: string

  @IsString()
  @IsIn(['praise', 'worship'])
  style: 'praise' | 'worship'

  @IsString()
  artist: string

  @ValidateNested({ each: true })
  @Type(() => UpdateSongTempo)
  tempo: UpdateSongTempo[]

  @ValidateNested({ each: true })
  @Type(() => UpdateSongKey)
  key: UpdateSongKey[]

  @ValidateNested({ each: true })
  @Type(() => UpdateSongLyrics)
  lyrics: UpdateSongLyrics[]

  @ValidateNested({ each: true })
  @Type(() => UpdateSongStructure)
  structure: UpdateSongStructure[]
}
