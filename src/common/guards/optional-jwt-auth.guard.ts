import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser } from '../decorators/current-user.decorator.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService);
  }

  async canActivate(context: Parameters<JwtAuthGuard['canActivate']>[0]): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: { authorization?: string }; user?: AuthenticatedUser }>();
    if (!request.headers.authorization) return true;
    return super.canActivate(context);
  }
}
