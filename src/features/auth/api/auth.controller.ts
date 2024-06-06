import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PATH } from '../../../settings/app.settings';
import { AuthService } from '../application/services/auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RegisterUserInputModel } from './models/input/register-user.input.model';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { AuthBearerGuard } from 'src/infrastructure/guards/auth.bearer.guard';
import { RegistrationConfirmationInputModel } from './models/input/registration-confirmation.input.model';
import { Request, Response } from 'express';
import { LoginInputModel } from './models/input/login.input.model';
import { ResendRegistrationConfirmationInputModel } from './models/input/resend.registration.confirmation.input.model';
import { PasswordRecoveryInputModel } from './models/input/password-recovery.input.model';
import { NewPasswordRecoveryInputModel } from './models/input/new-password-recovery.input.model';
import { RefreshTokenGuard } from '../../../infrastructure/guards/refresh.token.guard';

@Controller(PATH.AUTH)
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @UseGuards(AuthBearerGuard)
  @Get('/me')
  @HttpCode(200)
  async me(@Req() req: Request) {
    const userId = req['user'].userId;
    const user = await this.usersQueryRepository.getById(userId);
    if (!user) throw new UnauthorizedException();

    return {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
  }

  @Post('/registration')
  @HttpCode(204)
  async registerUser(@Body() userDto: RegisterUserInputModel) {
    const isRegistered = await this.authService.registerUser(userDto);
    if (!isRegistered)
      throw new InternalServerErrorException('Something went wrong! Try again');
    return;
  }

  @Post('/registration-confirmation')
  @HttpCode(204)
  async confirmRegistration(
    @Body() inputDto: RegistrationConfirmationInputModel,
  ) {
    const isConfirmed = await this.authService.confirmRegistration(
      inputDto.code,
    );
    if (!isConfirmed)
      throw new BadRequestException('Something went wrong! Try again');
    return;
  }

  @Post('/registration-email-resending')
  @HttpCode(204)
  async resendRegistrationConfirmation(
    @Body() inputDto: ResendRegistrationConfirmationInputModel,
  ) {
    const isResented = await this.authService.resendEmailConfirmation(
      inputDto.email,
    );
    if (!isResented)
      throw new BadRequestException('Something went wrong! Try again');
    return;
  }

  @Post('/password-recovery')
  @HttpCode(204)
  async recoverPassword(@Body() inputDto: PasswordRecoveryInputModel) {
    const isRecovered = await this.authService.recoverPassword(inputDto.email);
    if (!isRecovered)
      throw new BadRequestException('Something went wrong! Try again');
    return;
  }

  @Post('/new-password')
  @HttpCode(204)
  async resetPassword(@Body() inputDto: NewPasswordRecoveryInputModel) {
    const isReseted = await this.authService.resetPassword(inputDto);
    if (!isReseted)
      throw new BadRequestException('Something went wrong! Try again');
    return;
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() inputDto: LoginInputModel,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    const { refreshToken, accessToken } = await this.authService.login(
      inputDto,
      ip,
      userAgent,
    );

    this.setCookie(res, refreshToken);
    res.status(200).send({ accessToken });
    return;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res() res: Response) {
    const userId = req['userId'];
    const deviceId = req['deviceId'];
    const rt = req.cookies['refreshToken'];

    const isLogout = await this.authService.logout(userId, deviceId, rt);
    if (!isLogout) throw new InternalServerErrorException();
    res.sendStatus(204);
    return;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  @HttpCode(200)
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const userId = req['userId'];
    const deviceId = req['deviceId'];
    const rt = req.cookies['refreshToken'];

    const { refreshToken, accessToken } = await this.authService.refreshTokens(
      userId,
      deviceId,
      rt,
    );

    this.setCookie(res, refreshToken);
    res.status(200).send({ accessToken });
    return;
  }

  private setCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: true,
      // secure: process.env.NODE_ENV !== "development"
    });
  }
}
