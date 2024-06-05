import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/services/auth.service';
import { AuthRepository } from './infrastructure/auth.repository';
import { BcryptService } from '../../infrastructure/services/bcrypt.service';
import { MailModule } from '../../infrastructure/adapters/mail/mail.module';
import { UsersModule } from '../users/users.module';
import { CustomEmailConfirmationCodeValidation } from '../../infrastructure/decorators/validate/is-email-confirmation-code-valid';
import { CustomIsEmailConfirmedValidation } from '../../infrastructure/decorators/validate/is-email-confirmed';
import { CustomEmailOrLoginValidation } from '../../infrastructure/decorators/validate/is-email-or-login-unique';

@Module({
  imports: [TypeOrmModule.forFeature([]), MailModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    BcryptService,
    CustomEmailConfirmationCodeValidation,
    CustomIsEmailConfirmedValidation,
    CustomEmailOrLoginValidation,
  ],
})
export class AuthModule {}
