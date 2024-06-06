import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { Device } from '../../domain/device.entity';
import { DevicesService } from './devices.service';
import { DevicesRepository } from '../../infrastructure/devices.repository';
import { RtBlackListRepository } from '../../infrastructure/rt-black-list.repository';
import { RtBlackList } from '../../domain/rt-black-list.entity';

@Injectable()
export class AuthService {
  constructor(
    private bcryptService: BcryptService,
    private mailService: MailService,
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly passwordRecoveryRepository: PasswordRecoveryRepository,
    private devicesService: DevicesService,
    private devicesRepository: DevicesRepository,
    private readonly rtBlackListRepository: RtBlackListRepository,
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

    const device = Device.create(user, ip, userAgent);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ userId: user.id }),
      this.jwtService.signAsync(
        { userId: user.id, deviceId: device.deviceId },
        { expiresIn: CONFIG.REFRESH_TTL },
      ),
    ]);

    device.rt = refreshToken;
    await this.devicesRepository.save(device);

    return { accessToken, refreshToken };
  }

  async logout(userId: string, deviceId: string, rt: string): Promise<boolean> {
    const tokenForBlackList = RtBlackList.create(rt);
    const isPuttedInBlackList = await this.rtBlackListRepository.putInBlackList(
      [tokenForBlackList],
    );
    if (!isPuttedInBlackList) throw new BadRequestException();

    return await this.devicesService.deleteDeviceById(userId, deviceId);
  }

  async refreshTokens(
    userId: string,
    deviceId: string,
    rt: string,
  ): Promise<{
    refreshToken: string;
    accessToken: string;
  }> {
    const user = await this.usersRepository.getUserById(userId);
    if (!user) throw new UnauthorizedException();

    const device = await this.devicesRepository.getDevice(userId, deviceId);
    if (!device) throw new BadRequestException();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ userId: user.id }),
      this.jwtService.signAsync(
        { userId: user.id, deviceId: device.deviceId },
        { expiresIn: CONFIG.REFRESH_TTL },
      ),
    ]);

    device.rt = refreshToken;

    const tokenForBlackList = RtBlackList.create(rt);
    const isPuttedInBlackList = await this.rtBlackListRepository.putInBlackList(
      [tokenForBlackList],
    );
    if (!isPuttedInBlackList) throw new BadRequestException();

    const isDeviceUpdated = await this.devicesRepository.save(device);
    if (!isDeviceUpdated) throw new BadRequestException();

    return { refreshToken, accessToken };
  }
}
