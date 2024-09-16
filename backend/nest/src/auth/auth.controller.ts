import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AccessTokenGuard } from '../common/guards/'
import { LoginDTO } from './auth.dto'
import { CreateUserDTO } from '../users/user.dto'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) { }

  @Post('register')
  async register (@Body() req: CreateUserDTO) {
    return this.authService.signUp(req)
  }

  @Post('login')
  async login (@Body() req: LoginDTO) {
    return this.authService.signIn(req)
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout (@Request() req) {
    console.log(req.user.sub)
    return this.authService.logout(req.user.sub)
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile (@Request() req) {
    return req.user
  }
}
