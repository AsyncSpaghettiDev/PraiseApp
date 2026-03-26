import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CreateUserDTO, UpdateUserDTO } from './user.dto'
import { User } from '../schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel: Model<any>) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    return await this.usersModel.create(createUserDTO)
  }

  async findAll(): Promise<User[]> {
    return await this.usersModel.find().exec()
  }

  async findById(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) return null
    return await this.usersModel.findById(id).exec()
  }

  async findByUsername(username: string): Promise<User> {
    return await this.usersModel.findOne({ username }).exec()
  }

  async update(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    if (!Types.ObjectId.isValid(id)) return null
    return await this.usersModel
      .findByIdAndUpdate(id, updateUserDTO, { new: true })
      .exec()
  }

  async delete(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) return null
    return await this.usersModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec()
  }
}
