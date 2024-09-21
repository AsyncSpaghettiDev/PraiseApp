import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  private getTokenPayload(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET')
      })
      request.user = payload
      return payload
    } catch {
      throw new UnauthorizedException()
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await this.getTokenPayload(context)
    } catch {
      throw new UnauthorizedException()
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  roles: string[]
  constructor(
    roles: string[],
    private configService: ConfigService,
    private jwtService: JwtService
  ) {
    this.roles = roles
  }

  private getTokenPayload(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET')
      })
      request.user = payload
      return payload
    } catch {
      throw new UnauthorizedException()
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await this.getTokenPayload(context)
    } catch {
      throw new UnauthorizedException()
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
