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
export class SongKey {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  variant: string

  @Column()
  key: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => Song, (st) => st.key)
  song: Song

  @OneToMany(() => SetlistSong, (sts) => sts.key)
  setlistSong: SetlistSong[]
}
