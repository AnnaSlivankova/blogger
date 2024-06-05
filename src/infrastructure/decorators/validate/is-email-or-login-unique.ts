import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../features/users/infrastructure/users.repository';

export function IsEmailOrLoginUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CustomEmailOrLoginValidation,
    });
  };
}

@ValidatorConstraint({ name: 'IsEmailOrLoginUnique', async: false })
@Injectable()
export class CustomEmailOrLoginValidation
  implements ValidatorConstraintInterface
{
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    const user = await this.usersRepository.getUserByLoginOrEmail(value);

    return !user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'user already exists';
  }
}
