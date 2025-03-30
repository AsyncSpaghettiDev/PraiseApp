import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm'
import { Medley } from './medley'

@Entity()
export class MedleyLyrics {
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

  @ManyToOne(() => Medley, (st) => st.lyrics)
  medley: Medley
}
