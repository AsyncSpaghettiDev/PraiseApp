import { IsNotEmpty, IsMongoId, ValidateNested } from 'class-validator'
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
  @IsMongoId()
  id: string
}

export class UpdateSongTempo extends CreateSongTempo {
  @IsNotEmpty()
  @IsMongoId()
  id: string
}

export class UpdateSongKey extends CreateSongKey {
  @IsNotEmpty()
  @IsMongoId()
  id: string
}

export class UpdateSongLyrics extends CreateSongLyrics {
  @IsNotEmpty()
  @IsMongoId()
  id: string
}

export class UpdateSongStructure extends CreateSongStructure {
  @IsNotEmpty()
  @IsMongoId()
  id: string
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
  @IsMongoId()
  id: string
}
