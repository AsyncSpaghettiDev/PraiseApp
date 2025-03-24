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
export class MedleyStructure {
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

  @ManyToOne(() => Medley, (st) => st.structure)
  medley: Medley
}
