import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../users'
import { CreateUserDTO } from '../users/user.dto'
import { LoginDTO } from './auth.dto'
import { User } from '../schemas/user.schema'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  private getUserId(user: Pick<User, '_id'>): string {
    return user._id.toString()
  }

  async signUp(createUserDto: CreateUserDTO): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findByUsername(
      createUserDto.username
    )
    if (userExists) {
      throw new BadRequestException('User already exists')
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password)
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash
    })
    const userId = this.getUserId(newUser)
    const tokens = await this.getTokens(userId, newUser.username)
    await this.updateRefreshToken(userId, tokens.refreshToken)
    return tokens
  }

  async signIn(data: LoginDTO) {
    // Check if user exists
    const user = await this.usersService.findByUsername(data.username)
    if (!user) throw new BadRequestException('User does not exist')
    const passwordMatches = await argon2.verify(user.password, data.password)
    if (!passwordMatches) throw new BadRequestException('Password is incorrect')

    const tokens = await this.getTokens(
      this.getUserId(user),
      user.username,
      user.permissions
    )
    await this.updateRefreshToken(this.getUserId(user), tokens.refreshToken)
    return tokens
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null })
  }

  hashData(data: string) {
    return argon2.hash(data)
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken)
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken
    })
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId)
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied')
    }
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken
    )
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied 2')
    const tokens = await this.getTokens(
      this.getUserId(user),
      user.username,
      user.permissions
    )
    await this.updateRefreshToken(this.getUserId(user), tokens.refreshToken)
    return tokens
  }

  async getTokens(userId: string, username: string, permissions?: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          permissions: permissions ? JSON.parse(permissions) : []
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m'
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d'
        }
      )
    ])

    return {
      accessToken,
      refreshToken
    }
  }
}
