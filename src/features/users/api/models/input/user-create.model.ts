import { IsLoginValid } from '../../../../../infrastructure/decorators/validate/is-login-valid';
import { IsPasswordValid } from '../../../../../infrastructure/decorators/validate/is-password-valid';
import { IsEmailValid } from '../../../../../infrastructure/decorators/validate/is-email-valid';

export class UserCreateModel {
  @IsLoginValid()
  login: string;

  @IsPasswordValid()
  password: string;

  @IsEmailValid()
  email: string;
}
