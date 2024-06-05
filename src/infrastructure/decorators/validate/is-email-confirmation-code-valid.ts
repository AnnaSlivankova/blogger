import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { isBefore } from 'date-fns';
import { UsersRepository } from '../../../features/users/infrastructure/users.repository';

export function IsEmailConfirmationCodeValid(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CustomEmailConfirmationCodeValidation,
    });
  };
}

@ValidatorConstraint({ name: 'IsEmailConfirmationCodeValid', async: true })
@Injectable()
export class CustomEmailConfirmationCodeValidation
  implements ValidatorConstraintInterface
{
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    const [userId, confirmationCode] = value.split(' ');

    const user = await this.usersRepository.getUserById(userId);
    if (!user) return false;

    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.confirmationCode !== confirmationCode)
      return false;

    // const isCodeExpired = isBefore(
    //   new Date(),
    //   user.emailConfirmation.expirationDate,
    // );
    const isCodeExpired = isBefore(
      user.emailConfirmation.expirationDate,
      new Date(),
    );
    if (isCodeExpired) return false;

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'confirmation code is incorrect, expired or already been applied';
  }
}
