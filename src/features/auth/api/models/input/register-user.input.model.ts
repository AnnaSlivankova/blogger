import { IsLoginValid } from '../../../../../infrastructure/decorators/validate/is-login-valid';
import { IsPasswordValid } from '../../../../../infrastructure/decorators/validate/is-password-valid';
import { IsEmailValid } from '../../../../../infrastructure/decorators/validate/is-email-valid';
import { IsEmailOrLoginUnique } from '../../../../../infrastructure/decorators/validate/is-email-or-login-unique';

export class RegisterUserInputModel {
  @IsEmailOrLoginUnique()
  @IsLoginValid()
  login: string;

  @IsPasswordValid()
  password: string;

  @IsEmailOrLoginUnique()
  @IsEmailValid()
  email: string;
}
