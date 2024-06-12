import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/services/auth.service';
import { BcryptService } from '../../infrastructure/services/bcrypt.service';
import { MailModule } from '../../infrastructure/adapters/mail/mail.module';
import { UsersModule } from '../users/users.module';
import { CustomEmailConfirmationCodeValidation } from '../../infrastructure/decorators/validate/is-email-confirmation-code-valid';
import { CustomIsEmailConfirmedValidation } from '../../infrastructure/decorators/validate/is-email-confirmed';
import { CustomEmailOrLoginValidation } from '../../infrastructure/decorators/validate/is-email-or-login-unique';
import { DevicesController } from './api/devices.controller';
import { DevicesQueryRepository } from './infrastructure/devices-query.repository';
import { DevicesRepository } from './infrastructure/devices.repository';
import { DevicesService } from './application/services/devices.service';
import { Device } from './domain/device.entity';
import { RtBlackList } from './domain/rt-black-list.entity';
import { RtBlackListRepository } from './infrastructure/rt-black-list.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device, RtBlackList]),
    MailModule,
    UsersModule,
  ],
  controllers: [AuthController, DevicesController],
  providers: [
    AuthService,
    BcryptService,
    CustomEmailConfirmationCodeValidation,
    CustomIsEmailConfirmedValidation,
    CustomEmailOrLoginValidation,
    DevicesQueryRepository,
    DevicesRepository,
    DevicesService,
    RtBlackListRepository,
  ],
  exports: [RtBlackListRepository],
})
export class AuthModule {}
