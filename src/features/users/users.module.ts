import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfirmation } from './domain/email-confirmation.entity';
import { PasswordRecovery } from './domain/password-recovery.entity';
import { User } from './domain/user.entity';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/services/users.service';
import { UsersQueryRepository } from './infrastructure/users.query-repository';
import { UsersRepository } from './infrastructure/users.repository';
import { BcryptService } from '../../infrastructure/services/bcrypt.service';
import { EmailConfirmationRepository } from './infrastructure/email-confirmation.repository';
import { PasswordRecoveryRepository } from './infrastructure/password-recovery.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailConfirmation, PasswordRecovery]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersQueryRepository,
    UsersRepository,
    EmailConfirmationRepository,
    PasswordRecoveryRepository,
    BcryptService,
  ],
  exports: [
    UsersQueryRepository,
    UsersRepository,
    EmailConfirmationRepository,
    PasswordRecoveryRepository,
  ],
})
export class UsersModule {}
