import { IsNotEmpty, IsString } from 'class-validator'
import type { LoginRequest } from '@praise-app/types'

export class LoginDTO implements LoginRequest {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string
}
