import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '../../.env'
    }),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '60s' }
    })
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
