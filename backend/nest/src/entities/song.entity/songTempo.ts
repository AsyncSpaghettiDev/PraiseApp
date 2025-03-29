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
export class SongTempo {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  variant: string

  @Column()
  tempo: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => Song, (st) => st.tempo)
  song: Song
}
