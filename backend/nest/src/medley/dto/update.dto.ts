import {
  IsNumber,
  IsNotEmpty,
  IsNumberString,
  ValidateNested
} from 'class-validator'
import {
  CreateMedleyDTO,
  CreateMedleyKey,
  CreateMedleyLyrics,
  CreateMedleyStructure,
  CreateMedleyTempo
} from './create.dto'
import { Type } from 'class-transformer'

export class MedleyUpdateId {
  @IsNotEmpty()
  @IsNumberString()
  id: string
}

export class UpdateMedleyTempo extends CreateMedleyTempo {
  @IsNotEmpty()
  @IsNumber()
  id: number
}

export class UpdateMedleyKey extends CreateMedleyKey {
  @IsNotEmpty()
  @IsNumber()
  id: number
}

export class UpdateMedleyLyrics extends CreateMedleyLyrics {
  @IsNotEmpty()
  @IsNumber()
  id: number
}

export class UpdateMedleyStructure extends CreateMedleyStructure {
  @IsNotEmpty()
  @IsNumber()
  id: number
}

export class UpdateMedleyDTO extends CreateMedleyDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ValidateNested({ each: true })
  @Type(() => UpdateMedleyTempo)
  tempo: UpdateMedleyTempo[]

  @ValidateNested({ each: true })
  @Type(() => UpdateMedleyKey)
  key: UpdateMedleyKey[]

  @ValidateNested({ each: true })
  @Type(() => UpdateMedleyLyrics)
  lyrics: UpdateMedleyLyrics[]

  @ValidateNested({ each: true })
  @Type(() => UpdateMedleyStructure)
  structure: UpdateMedleyStructure[]
}
