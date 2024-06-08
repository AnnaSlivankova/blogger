import {
  Controller,
  Delete,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from '../users/domain/user.entity';
import { PasswordRecovery } from '../users/domain/password-recovery.entity';
import { EmailConfirmation } from '../users/domain/email-confirmation.entity';
import { Device } from '../auth/domain/device.entity';
import { RtBlackList } from '../auth/domain/rt-black-list.entity';
import { Blog } from '../blogs/domain/blog.entity';
import { Post } from '../blogs/domain/post.entity';

@Controller()
export class DropAllDataController {
  constructor(private readonly entityManager: EntityManager) {}

  @Delete('testing/all-data')
  @HttpCode(204)
  async delete() {
    try {
      await Promise.all([
        this.entityManager.createQueryBuilder().delete().from(User).execute(),
        this.entityManager
          .createQueryBuilder()
          .delete()
          .from(PasswordRecovery)
          .execute(),
        this.entityManager
          .createQueryBuilder()
          .delete()
          .from(EmailConfirmation)
          .execute(),
        this.entityManager.createQueryBuilder().delete().from(Device).execute(),
        this.entityManager
          .createQueryBuilder()
          .delete()
          .from(RtBlackList)
          .execute(),
        this.entityManager.createQueryBuilder().delete().from(Blog).execute(),
        this.entityManager
          .createQueryBuilder()
          .delete()
          .from(RtBlackList)
          .execute(),
        this.entityManager.createQueryBuilder().delete().from(Post).execute(),
      ]);
      return;
    } catch (e) {
      console.log('DropAllDataController/delete', e);
      throw new InternalServerErrorException('DropAllDataController/delete');
    }
  }
}
