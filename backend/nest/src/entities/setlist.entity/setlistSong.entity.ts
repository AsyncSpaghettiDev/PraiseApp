import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import {
  Song,
  SongTempo,
  SongKey,
  SongLyrics,
  SongStructure
} from '../song.entity'
import { Setlist } from './setlist.entity'

@Entity()
export class SetlistSong {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Setlist, (setlist) => setlist.setlistSongs)
  setlist: Setlist

  @ManyToOne(() => Song, (song) => song.setlistSongs)
  song: Song

  @ManyToOne(() => SongTempo, (st) => st.setlistSong, { cascade: true })
  tempo: SongTempo

  @ManyToOne(() => SongKey, (st) => st.setlistSong, { cascade: true })
  key: SongKey

  @ManyToOne(() => SongLyrics, (st) => st.setlistSong, { cascade: true })
  lyrics: SongLyrics

  @ManyToOne(() => SongStructure, (st) => st.setlistSong, { cascade: true })
  structure: SongStructure
}
