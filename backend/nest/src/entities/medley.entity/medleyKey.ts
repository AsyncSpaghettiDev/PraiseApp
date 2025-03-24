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
export class MedleyKey {
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

  @ManyToOne(() => Medley, (st) => st.key)
  medley: Medley
}
