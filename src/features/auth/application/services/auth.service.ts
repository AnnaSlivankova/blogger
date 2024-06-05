import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { RegisterUserInputModel } from '../../api/models/input/register-user.input.model';
import { BcryptService } from '../../../../infrastructure/services/bcrypt.service';
import { User } from '../../../users/domain/user.entity';
import { MailService } from '../../../../infrastructure/adapters/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailConfirmation } from '../../../users/domain/email-confirmation.entity';
import { EmailConfirmationRepository } from '../../../users/infrastructure/email-confirmation.repository';
import { PasswordRecovery } from '../../../users/domain/password-recovery.entity';
import { PasswordRecoveryRepository } from '../../../users/infrastructure/password-recovery.repository';
import { NewPasswordRecoveryInputModel } from '../../api/models/input/new-password-recovery.input.model';
import { LoginInputModel } from '../../api/models/input/login.input.model';
import { CONFIG } from '../../../../settings/app.settings';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private bcryptService: BcryptService,
    private mailService: MailService,
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly passwordRecoveryRepository: PasswordRecoveryRepository,
  ) {}

  async registerUser(dto: RegisterUserInputModel): Promise<boolean> {
    const { login, email, password } = dto;
    const hash = await this.bcryptService.generateHash(password);

    const user = User.create({ hash, login, email });
    const emailConfirmation = EmailConfirmation.create(user);

    const userId = await this.usersRepository.save(user, emailConfirmation);
    if (!userId) return false;

    await this.mailService.sendEmailConfirmation(
      { email, login },
      `${userId} ${emailConfirmation.confirmationCode}`,
    );

    return !!userId;
  }

  async confirmRegistration(code: string): Promise<boolean> {
    const [userId] = code.split(' ');
    const userConfirmData = await this.emailConfirmationRepository.getByUserId(
      userId,
    );
    userConfirmData.confirmStatus();

    return await this.emailConfirmationRepository.updateConfirmationData(
      userId,
      userConfirmData,
    );
  }

  async resendEmailConfirmation(email: string): Promise<boolean> {
    const user = await this.usersRepository.getUserByLoginOrEmail(email);
    const emailConfirmation = EmailConfirmation.create(user);

    const isConfDataUpdated =
      await this.emailConfirmationRepository.updateConfirmationData(
        user.id,
        emailConfirmation,
      );
    if (!isConfDataUpdated)
      throw new InternalServerErrorException('isConfirmDataChanged error');

    await this.mailService.sendEmailConfirmation(
      { email, login: user.login },
      `${user.id} ${emailConfirmation.confirmationCode}`,
    );

    return true;
  }

  async recoverPassword(email: string): Promise<boolean> {
    const user = await this.usersRepository.getUserByLoginOrEmail(email);
    if (!user) return true;
    const passwordRecoveryData = PasswordRecovery.create(user);

    const isRecovered =
      await this.passwordRecoveryRepository.saveOrUpdatePassRecoveryData(
        passwordRecoveryData,
      );
    if (!isRecovered)
      throw new InternalServerErrorException('isRecoveredPWD error');

    await this.mailService.sendPasswordRecovery(
      { email, login: user.login },
      `${user.id} ${passwordRecoveryData.recoveryCode}`,
    );

    return true;
  }

  async resetPassword(dto: NewPasswordRecoveryInputModel): Promise<boolean> {
    const { newPassword, recoveryCode } = dto;
    const [userId, code] = recoveryCode.split(' ');

    const user = await this.usersRepository.getUserById(userId);
    if (!user) throw new BadRequestException();

    const hash = await this.bcryptService.generateHash(newPassword);
    user.hash = hash;

    const recoveryData = await this.passwordRecoveryRepository.getByUserId(
      userId,
    );

    if (
      user.passwordRecovery.recoveryCode !== recoveryCode ||
      recoveryData.isExpired
    )
      throw new BadRequestException('recovery code is expired or invalid');

    recoveryData.expirationDate = null;
    recoveryData.recoveryCode = null;

    await this.usersRepository.save(user);
    await this.passwordRecoveryRepository.saveOrUpdatePassRecoveryData(
      recoveryData,
    );

    return true;
  }

  async login(
    dto: LoginInputModel,
    ip: string,
    userAgent: string,
  ): Promise<{
    refreshToken: string;
    accessToken: string;
  }> {
    const { loginOrEmail, password } = dto;

    const user = await this.usersRepository.getUserByLoginOrEmail(loginOrEmail);
    if (!user) throw new UnauthorizedException();

    const isPasswordValid = await this.bcryptService.compareHashes(
      password,
      user.hash,
    );
    if (!isPasswordValid) throw new UnauthorizedException();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ userId: user.id }),
      this.jwtService.signAsync(
        { userId: user.id },
        { expiresIn: CONFIG.REFRESH_TTL },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
