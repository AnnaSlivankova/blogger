import { IsEmailValid } from '../../../../../infrastructure/decorators/validate/is-email-valid';

export class PasswordRecoveryInputModel {
  @IsEmailValid()
  email: string;
}
