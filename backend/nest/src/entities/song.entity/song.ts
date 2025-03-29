import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { SongTempo } from './songTempo'
import { SongKey } from './songKey'
import { SongLyrics } from './songLyrics'
import { SongStructure } from './songStructure'

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  style: 'praise' | 'worship'

  @Column()
  artist: string

  @OneToMany(() => SongTempo, (st) => st.song, { cascade: true })
  tempo: SongTempo[]

  @OneToMany(() => SongKey, (st) => st.song, { cascade: true })
  key: SongKey[]

  @OneToMany(() => SongLyrics, (st) => st.song, { cascade: true })
  lyrics: SongLyrics[]

  @OneToMany(() => SongStructure, (st) => st.song, { cascade: true })
  structure: SongStructure[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
