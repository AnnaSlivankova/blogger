import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../features/users/infrastructure/users.repository';

export function IsEmailConfirmed(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CustomIsEmailConfirmedValidation,
    });
  };
}

@ValidatorConstraint({ name: 'IsEmailConfirmed', async: false })
@Injectable()
export class CustomIsEmailConfirmedValidation
  implements ValidatorConstraintInterface
{
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    const user = await this.usersRepository.getUserByLoginOrEmail(value);
    if (!user || user.emailConfirmation.isConfirmed) return false;
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'user not exists or email had been already confirmed';
  }
}
