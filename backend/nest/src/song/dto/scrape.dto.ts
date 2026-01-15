import { IsNotEmpty, IsString } from 'class-validator'

export class ScrapeSongDTO {
  @IsString()
  @IsNotEmpty()
  query: string
}

export interface ScrapeSongResult {
  title: string
  artist: string
  key: string
  duration: string
  bpm: string
  links: {
    spotify: string
    apple: string
  }
}
