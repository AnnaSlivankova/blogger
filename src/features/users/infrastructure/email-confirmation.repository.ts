import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EmailConfirmation } from '../domain/email-confirmation.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailConfirmationRepository {
  constructor(
    @InjectRepository(EmailConfirmation)
    private readonly emailConfirmation: Repository<EmailConfirmation>,
  ) {}

  async updateConfirmationData(
    userId: string,
    data: EmailConfirmation,
  ): Promise<boolean> {
    try {
      const res = await this.emailConfirmation.update({ userId }, data);

      return !!res.affected;
    } catch (e) {
      console.log('EmailConfirmationRepository/updateConfData', e);
      return false;
    }
  }

  async getByUserId(userId: string): Promise<EmailConfirmation | null> {
    try {
      return await this.emailConfirmation.findOne({
        where: { userId },
      });
    } catch (e) {
      console.log('EmailConfirmationRepository/getByUserId', e);
      return null;
    }
  }
}
