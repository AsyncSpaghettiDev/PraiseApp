import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { AuthenticatedGuard } from '../common/guards'

@Controller('users')
export class UsersController {
  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
