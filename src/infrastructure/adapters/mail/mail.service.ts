import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CONFIG } from '../../../settings/app.settings';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailConfirmation(
    user: { email: string; login: string },
    code: string,
  ) {
    const url = `${CONFIG.CONFIRM_EMAIL_LINK}?code=${code}`;
    try {
      await this.mailerService.sendMail({
        to: user.email,
        template: './confirmation.hbs',
        context: {
          userLogin: user.login,
          url,
        },
      });
    } catch (e) {
      console.log('MailService/sendEmailConfirmation', e);
      throw new InternalServerErrorException(
        'MailService/sendEmailConfirmation',
      );
    }
  }

  async sendPasswordRecovery(
    user: { email: string; login: string },
    code: string,
  ) {
    const url = `${CONFIG.PASS_RECOVERY_LINK}?code=${code}`;
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Password recovery',
        template: './recovery.hbs',
        context: {
          userLogin: user.login,
          url,
        },
      });
    } catch (e) {
      console.log('MailService/sendPasswordRecovery', e);
      throw new InternalServerErrorException(
        'MailService/sendPasswordRecovery',
      );
    }
  }
}
