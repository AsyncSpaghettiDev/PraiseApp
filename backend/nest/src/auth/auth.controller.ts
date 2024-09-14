import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDTO } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login (@Request() _req, @Body() body: LoginDTO) {
    return this.authService.signIn(body.username, body.password)
  }

  @Post('register')
  async register (@Request() req) {
    return req.user
  }

  @Post('logout')
  async logout (@Request() req) {
    return req.user
  }

  @Get('profile')
  async profile (@Request() req) {
    return req.user
  }
}
