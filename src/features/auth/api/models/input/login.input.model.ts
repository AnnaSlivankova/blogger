import { IsDefined, IsString } from 'class-validator';
import { Trim } from '../../../../../infrastructure/decorators/transform/trim';

export class LoginInputModel {
  @Trim()
  @IsString()
  @IsDefined()
  loginOrEmail: string;

  @Trim()
  @IsString()
  @IsDefined()
  password: string;
}
