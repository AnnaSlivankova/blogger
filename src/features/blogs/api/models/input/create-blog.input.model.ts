import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsDefined, IsString, Length, Matches } from 'class-validator';

export class CreateBlogInputModel {
  @Trim()
  @Length(1, 15, { message: 'name is too long' })
  @IsString({ message: 'name must be a string' })
  @IsDefined()
  name: string;

  @Trim()
  @Length(1, 500, { message: 'description is too long' })
  @IsString({ message: 'description must be a string' })
  @IsDefined()
  description: string;

  @Trim()
  @Matches(
    '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$',
  )
  @IsString({ message: 'websiteUrl must be a string' })
  @Length(1, 100, { message: 'websiteUrl is too long' })
  @IsDefined()
  websiteUrl: string;
}
