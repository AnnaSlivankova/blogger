import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BcryptService } from '../../../../infrastructure/services/bcrypt.service';
import { UserCreateModel } from '../../api/models/input/user-create.model';
import { User } from '../../domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailConfirmation } from '../../domain/email-confirmation.entity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
  ) {}

  async create(user: UserCreateModel): Promise<string | null> {
    const { password, login, email } = user;
    const hash = await this.bcryptService.generateHash(password);
    const userDto = User.create({ hash, login, email });
    const emailConfirmation = EmailConfirmation.create(userDto, true);

    return await this.usersRepository.save(userDto, emailConfirmation);
  }

  async deleteById(id: string): Promise<boolean> {
    return await this.usersRepository.deleteById(id);
  }
}
