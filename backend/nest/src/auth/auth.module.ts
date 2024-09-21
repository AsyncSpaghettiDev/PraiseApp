import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies'

@Module({
  imports: [UsersModule, JwtModule.register({ global: true })],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
