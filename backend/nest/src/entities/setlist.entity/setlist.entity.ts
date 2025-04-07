import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn
} from 'typeorm'
import { SetlistSong } from './setlistSong.entity'

@Entity()
export class Setlist {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  date: Date

  @OneToMany(() => SetlistSong, (setlistSong) => setlistSong.setlist, {
    cascade: true
  })
  setlistSongs: SetlistSong[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
