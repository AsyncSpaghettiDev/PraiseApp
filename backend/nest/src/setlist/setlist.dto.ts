import { Type } from 'class-transformer'
import {
  IsIn,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsString,
  ValidateNested
} from 'class-validator'

export class CreateSongTempoDTO {
  @IsNotEmpty()
  @IsString()
  variant: string

  @IsNotEmpty()
  @IsNumber()
  tempo: number
}

export class CreateSongKeyDTO {
  @IsNotEmpty()
  @IsString()
  variant: string

  @IsNotEmpty()
  @IsString()
  key: string
}

export class CreateSongLyricsDTO {
  @IsNotEmpty()
  @IsString()
  variant: string

  @IsNotEmpty()
  @IsString()
  lyrics: string
}

export class CreateSongStructureDTO {
  @IsNotEmpty()
  @IsString()
  variant: string

  @IsNotEmpty()
  @IsString()
  structure: string
}

export class CreateSetlistSongDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsIn(['praise', 'worship'])
  style: 'praise' | 'worship'

  @IsNotEmpty()
  @IsString()
  artist: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateSongTempoDTO)
  tempo: CreateSongTempoDTO

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateSongKeyDTO)
  key: CreateSongKeyDTO

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateSongLyricsDTO)
  lyrics: CreateSongLyricsDTO

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateSongStructureDTO)
  structure: CreateSongStructureDTO
}

export class SetlistId {
  @IsNotEmpty()
  @IsMongoId()
  id: string
}

export class CreateSetlistDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tags: string[]

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
  @IsMongoId()
  id: string
}

export class UpdateSetlistDTO extends CreateSetlistDTO {
  @IsNotEmpty()
  @IsMongoId()
  id: string

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSetlistSongDTO)
  songs: UpdateSetlistSongDTO[]
}
