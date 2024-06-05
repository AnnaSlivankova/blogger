import { IsPasswordValid } from '../../../../../infrastructure/decorators/validate/is-password-valid';
import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsDefined, IsString, Matches } from 'class-validator';

export class NewPasswordRecoveryInputModel {
  @IsPasswordValid()
  newPassword: string;

  @Trim()
  @Matches(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12} [0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    { message: 'invalid code' },
  )
  @IsString()
  @IsDefined()
  recoveryCode: string;
}
