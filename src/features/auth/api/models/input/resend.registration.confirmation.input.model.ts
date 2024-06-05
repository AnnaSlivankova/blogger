import { IsEmailValid } from '../../../../../infrastructure/decorators/validate/is-email-valid';
import { IsEmailConfirmed } from '../../../../../infrastructure/decorators/validate/is-email-confirmed';

export class ResendRegistrationConfirmationInputModel {
  @IsEmailConfirmed()
  @IsEmailValid()
  email: string;
}
