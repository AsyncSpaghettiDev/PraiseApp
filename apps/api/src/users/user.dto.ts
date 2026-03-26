import { PartialType } from '@nestjs/mapped-types'

import { IsString, IsNotEmpty } from 'class-validator'
import type { CreateUser } from '@praise-app/types'

export class CreateUserDTO implements CreateUser {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string

  @IsString()
  readonly lastName: string

  @IsString()
  @IsNotEmpty()
  readonly username: string

  @IsString()
  @IsNotEmpty()
  readonly password: string

  refreshToken?: string
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
