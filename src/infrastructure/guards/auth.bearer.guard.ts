import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CONFIG } from '../../settings/app.settings';
import { Request } from 'express';

@Injectable()
export class AuthBearerGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token)
      throw new UnauthorizedException('accessToken is invalid or expired');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: CONFIG.JWT_SECRET,
      });

      request['userId'] = payload.userId;
    } catch {
      throw new UnauthorizedException('accessToken is invalid or expired');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
