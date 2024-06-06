import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { EmailConfirmation } from '../domain/email-confirmation.entity';
import { PasswordRecovery } from '../domain/password-recovery.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(EmailConfirmation)
    private readonly emailConfirmation: Repository<EmailConfirmation>,
  ) {}

  async save(user: User, ec?: EmailConfirmation): Promise<string | null> {
    try {
      const savedUser = await this.usersRepository.save(user);
      if (ec) {
        await this.emailConfirmation.save(ec);
      }

      return savedUser.id;
    } catch (e) {
      console.log('UsersRepository/save', e);
      return null;
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const res = await this.usersRepository.delete({ id });

      return !!res.affected; //{ raw: [], affected: 1 }
    } catch (e) {
      console.log('UsersRepository/deleteById', e);
      return false;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({
        where: { id },
        relations: ['emailConfirmation', 'passwordRecovery'],
      });
    } catch (e) {
      console.log('UsersRepository/getUserById', e);
      return null;
    }
  }

  async getUserByLoginOrEmail(value: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({
        where: [{ email: value }, { login: value }],
        relations: ['emailConfirmation', 'passwordRecovery'],
      });
    } catch (e) {
      console.log('UsersRepository/getUserByLoginOrEmail', e);
      return null;
    }
  }
}
