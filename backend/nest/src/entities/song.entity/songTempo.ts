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

  @OneToMany(() => SetlistSong, (sts) => sts.tempo)
  setlistSong: SetlistSong[]
}
