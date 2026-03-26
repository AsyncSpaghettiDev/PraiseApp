import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class User {
  _id: Types.ObjectId

  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop()
  permissions?: string

  @Prop()
  refreshToken?: string

  @Prop()
  teamId?: Types.ObjectId

  @Prop()
  createdAt: Date

  @Prop()
  deletedAt?: Date
}

export type UserDocument = HydratedDocument<User>

export const UserSchema = SchemaFactory.createForClass(User)
