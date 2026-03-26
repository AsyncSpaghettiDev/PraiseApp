import { IsNotEmpty, IsMongoId, ValidateNested } from 'class-validator'
import {
  CreateSongDTO,
  CreateSongKey,
  CreateSongLyrics,
  CreateSongStructure,
  CreateSongTempo
} from './create.dto'
import { Type } from 'class-transformer'
import type { UpdateSongRequest } from '@praise-app/types'

export class SongUpdateId {
  @IsNotEmpty()
  @IsMongoId()
  id: string
}

export class UpdateSongTempo extends CreateSongTempo {}

export class UpdateSongKey extends CreateSongKey {}

export class UpdateSongLyrics extends CreateSongLyrics {}

export class UpdateSongStructure extends CreateSongStructure {}

export class UpdateSongDTO extends CreateSongDTO implements UpdateSongRequest {
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
