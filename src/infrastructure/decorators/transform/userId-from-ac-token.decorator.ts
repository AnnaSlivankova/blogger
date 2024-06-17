import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const UserIdFromAcToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const jwtService = new JwtService();

    const jwtToken = req.headers['authorization'];

    if (!jwtToken) return undefined;

    try {
      const token = jwtToken.split(' ')[1];
      const decodedToken = jwtService.decode(token);
      return decodedToken['userId'];
    } catch (e) {
      console.log('AccessToken/decorator', e);
      return undefined;
    }
  },
);
