import { SongTempo, SongKey, SongLyrics, SongStructure } from './song'

export interface SetlistItem {
  _id: string;
  name: string;
  artist: string;
  style: string;
}

export interface SetlistSongRequest {
  name: string;
  style: 'praise' | 'worship';
  artist: string;
  tempo: SongTempo;
  key: SongKey;
  lyrics: SongLyrics;
  structure: SongStructure;
}

export interface CreateSetlistRequest {
  name: string;
  tags: string[];
  date: string | Date;
  songs: SetlistSongRequest[];
}

export type UpdateSetlistRequest = CreateSetlistRequest

export interface SetlistSongResponse extends SetlistSongRequest {
  _id?: string;
}

export interface SetlistResponse {
  _id: string;
  name: string;
  date: string;
  tags: string[];
  songs: SetlistSongResponse[];
  createdAt?: string;
  updatedAt?: string;
}
