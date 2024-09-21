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

interface jwtPayload {
  userId: number
  username: string
  permissions?: string
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

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
    const tokens = await this.getTokens({
      userId: newUser.id,
      username: newUser.username
    })
    await this.updateRefreshToken(newUser.id, tokens.refreshToken)
    return tokens
  }

  async signIn(data: LoginDTO) {
    // Check if user exists
    const user = await this.usersService.findByUsername(data.username)
    if (!user) throw new BadRequestException('User does not exist')
    const passwordMatches = await argon2.verify(user.password, data.password)
    if (!passwordMatches) throw new BadRequestException('Password is incorrect')

    const tokens = await this.getTokens({
      userId: user.id,
      username: user.username,
      permissions: user.permissions
    })
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }

  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null })
  }

  hashData(data: string) {
    return argon2.hash(data)
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken)
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken
    })
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId)
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied')
    }
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken
    )
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied 2')
    const tokens = await this.getTokens({
      userId: user.id,
      username: user.username,
      permissions: user.permissions
    })
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }

  async getAccessToken({ userId, username, permissions }: jwtPayload) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        username,
        permissions: JSON.parse(permissions) || []
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m'
      }
    )
  }

  async getRefreshToken({ userId, username }: jwtPayload) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        username
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d'
      }
    )
  }

  async getTokens({
    userId,
    username,
    permissions
  }: jwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken({ userId, username, permissions }),
      this.getRefreshToken({ userId, username })
    ])

    return {
      accessToken,
      refreshToken
    }
  }
}
