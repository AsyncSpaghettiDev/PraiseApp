import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities'
import { Repository } from 'typeorm'
import { CreateUserDTO, UpdateUserDTO } from './user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    return await this.usersRepository.save(createUserDTO)
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find()
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({
      id
    })
  }

  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOneBy({
      username
    })
  }

  async update(id: number, updateUserDTO: UpdateUserDTO): Promise<User> {
    await this.usersRepository.update(id, updateUserDTO)
    return await this.usersRepository.findOneBy({ id })
  }

  async delete(id: number): Promise<User> {
    await this.usersRepository.softDelete(id)
    return await this.usersRepository.findOneBy({ id })
  }
}
