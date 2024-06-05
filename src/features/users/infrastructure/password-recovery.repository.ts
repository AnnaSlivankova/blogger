import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordRecovery } from '../domain/password-recovery.entity';

@Injectable()
export class PasswordRecoveryRepository {
  constructor(
    @InjectRepository(PasswordRecovery)
    private readonly passwordRecovery: Repository<PasswordRecovery>,
  ) {}

  async saveOrUpdatePassRecoveryData(data: PasswordRecovery): Promise<boolean> {
    try {
      const res = await this.passwordRecovery.save({ ...data });
      return !!res;
    } catch (e) {
      console.log('PasswordRecoveryRepository/updatePassRecoveryData', e);
      return false;
    }
  }

  async getByUserId(userId: string): Promise<PasswordRecovery | null> {
    try {
      return await this.passwordRecovery.findOne({
        where: { userId },
      });
    } catch (e) {
      console.log('PasswordRecoveryRepository/getByUserId', e);
      return null;
    }
  }
}
