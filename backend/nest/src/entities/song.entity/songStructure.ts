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
export class SongStructure {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  variant: string

  @Column()
  structure: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => Song, (st) => st.structure)
  song: Song
}
