import {
  IsNumber,
  IsNotEmpty,
  IsNumberString,
  ValidateNested
} from 'class-validator'
import {
  CreateSongDTO,
  CreateSongKey,
  CreateSongLyrics,
  CreateSongStructure,
  CreateSongTempo
} from './create.dto'
import { Type } from 'class-transformer'

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

export class UpdateSongDTO extends CreateSongDTO {
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

  @IsNotEmpty()
  @IsNumber()
  id: number
}
