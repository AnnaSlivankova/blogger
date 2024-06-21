import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsDefined, IsString, Length } from 'class-validator';

export class UpdateCommentInputModel {
  @Trim()
  @Length(20, 300, { message: 'content is too long' })
  @IsString({ message: 'content must be a string' })
  @IsDefined()
  content: string;
}
