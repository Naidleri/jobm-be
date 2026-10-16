import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser } from '../decorators/current-user.decorator.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: { authorization?: string }; user?: AuthenticatedUser }>();
    const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
    const secret = this.configService.get<string>('app.jwtSecret');

    if (!token || !secret) {
      throw new UnauthorizedException('Bearer token is required');
    }

    try {
      request.user = await this.jwtService.verifyAsync<AuthenticatedUser>(token, {
        secret,
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
