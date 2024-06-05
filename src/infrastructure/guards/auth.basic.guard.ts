import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CONFIG } from '../../settings/app.settings';

@Injectable()
export class AuthBasicGuard implements CanActivate {
  private readonly rightHeader: string;

  constructor() {
    const base64Creds = Buffer.from(
      `${CONFIG.LOGIN_CRED}:${CONFIG.PASS_CRED}`,
      'utf-8',
    ).toString('base64');

    this.rightHeader = `Basic ${base64Creds}`;
  }

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers.authorization)
      throw new UnauthorizedException('You should use Basic auth');

    return this.authorize(request.headers.authorization);
  }

  private authorize(authHeader: string): boolean {
    if (!authHeader.startsWith('Basic '))
      throw new UnauthorizedException('You should use Basic auth');

    if (authHeader !== this.rightHeader)
      throw new UnauthorizedException('Wrong credentials');

    return true;
  }
}
