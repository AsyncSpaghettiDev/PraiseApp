import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { MedleyTempo } from './medleyTempo'
import { MedleyKey } from './medleyKey'
import { MedleyLyrics } from './medleyLyrics'
import { MedleyStructure } from './medleyStructure'

@Entity('medleys')
export class Medley {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  style: 'praise' | 'worship'

  @Column()
  artist: string

  @OneToMany(() => MedleyTempo, (st) => st.medley, { cascade: true })
  tempo: MedleyTempo[]

  @OneToMany(() => MedleyKey, (st) => st.medley, { cascade: true })
  key: MedleyKey[]

  @OneToMany(() => MedleyLyrics, (st) => st.medley, { cascade: true })
  lyrics: MedleyLyrics[]

  @OneToMany(() => MedleyStructure, (st) => st.medley, { cascade: true })
  structure: MedleyStructure[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
