import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './utils/LocalGuards'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login (@Request() req) {
    return this.authService.login(req.user)
  }

  @Get('profile')
  async profile (@Request() req) {
    return req.user
  }
}
