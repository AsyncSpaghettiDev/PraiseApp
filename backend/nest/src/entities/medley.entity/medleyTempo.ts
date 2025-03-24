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
export class MedleyTempo {
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

  @ManyToOne(() => Medley, (st) => st.tempo)
  medley: Medley
}
