import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm'
import { Song } from './song'
import { SetlistSong } from '../setlist.entity'

@Entity()
export class SongLyrics {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  variant: string

  @Column()
  lyrics: string

  @Column()
  normalizedLyrics: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => Song, (st) => st.lyrics)
  song: Song

  @OneToMany(() => SetlistSong, (sts) => sts.lyrics)
  setlistSong: SetlistSong[]
}
