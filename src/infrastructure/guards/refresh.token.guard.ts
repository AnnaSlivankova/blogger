import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RtBlackListRepository } from '../../features/auth/infrastructure/rt-black-list.repository';
import { CONFIG } from '../../settings/app.settings';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    public blackListRepository: RtBlackListRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token)
      throw new UnauthorizedException('refreshToken is invalid or expired');

    try {
      const isTokenInBlackList = await this.blackListRepository.getByToken(
        token,
      );

      if (isTokenInBlackList) {
        throw new UnauthorizedException(
          'refreshToken is invalid or expired BL',
        );
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: CONFIG.JWT_SECRET,
      });

      request['userId'] = payload.userId;
      request['deviceId'] = payload.deviceId;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('refreshToken is invalid or expired');
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const token = request.cookies['refreshToken'];
    return token ? token : undefined;
  }
}
