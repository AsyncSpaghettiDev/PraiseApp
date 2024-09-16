import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  ManyToOne
} from 'typeorm'

import { Team } from './team.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @ManyToOne(() => Team, (team) => team.users)
  team: Team

  @Column()
  username: string

  @Column()
  password: string

  @Column({ nullable: true })
  permissions: string

  @Column({ nullable: true })
  refreshToken: string

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
