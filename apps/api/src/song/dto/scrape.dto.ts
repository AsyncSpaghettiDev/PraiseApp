import { IsNotEmpty, IsString } from 'class-validator'
import type { ScrapeSongRequest, ScrapeSongResult } from '@praise-app/types'

export class ScrapeSongDTO implements ScrapeSongRequest {
  @IsString()
  @IsNotEmpty()
  query: string
}

export type { ScrapeSongResult }
