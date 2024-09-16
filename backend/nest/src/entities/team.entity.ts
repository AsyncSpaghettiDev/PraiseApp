import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  OneToMany
} from 'typeorm'

import { User } from './user.entity'

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @OneToMany(() => User, (user) => user.team)
  users: User[]

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
