import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { AccessTokenGuard } from '../common/guards'

@Controller('users')
export class UsersController {
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile (@Request() req) {
    return req.user
  }
}
