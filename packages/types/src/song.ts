export interface SongTempo {
  variant: string;
  tempo: number;
  signature: string;
}

export interface SongKey {
  variant: string;
  key: string;
}

export interface SongLyrics {
  variant: string;
  lyrics: string;
}

export interface SongStructure {
  variant: string;
  structure: string[];
}

export interface CreateSongRequest {
  name: string;
  style: 'praise' | 'worship';
  artist: string;
  tags: string[];
  tempo: SongTempo[];
  key: SongKey[];
  lyrics: SongLyrics[];
  structure: SongStructure[];
}

export type UpdateSongRequest = CreateSongRequest

export interface SongResponse {
  _id: string;
  name: string;
  style: 'praise' | 'worship';
  artist: string;
  tags: string[];
  tempo: SongTempo[];
  key: SongKey[];
  lyrics: SongLyrics[];
  structure: SongStructure[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ScrapeSongRequest {
  query: string;
}

export interface ScrapeSongResult {
  title: string;
  artist: string;
  key: string;
  duration: string;
  bpm: string;
  links: {
    spotify: string;
    apple: string;
  };
}
