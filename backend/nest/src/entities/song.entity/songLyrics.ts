import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm'
import { Song } from './song'

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
}
