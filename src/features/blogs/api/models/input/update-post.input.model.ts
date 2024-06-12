import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsDefined, IsString, Length } from 'class-validator';

export class UpdatePostInputModel {
  @Trim()
  @IsString()
  @Length(1, 30, { message: 'title is too long' })
  @IsDefined()
  title: string;

  @Trim()
  @IsString()
  @Length(1, 100, { message: 'shortDescription is too long' })
  @IsDefined()
  shortDescription: string;

  @Trim()
  @IsString({ message: 'content must be a string' })
  @Length(1, 1000, { message: 'content is too long' })
  @IsDefined()
  content: string;
}
