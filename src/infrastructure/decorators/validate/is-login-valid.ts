import { applyDecorators } from '@nestjs/common/decorators';
import { IsDefined, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../transform/trim';

export const IsLoginValid = () => {
  return applyDecorators(
    IsDefined(),
    IsString(),
    Length(3, 10, { message: 'login is not correct' }),
    Matches('^[a-zA-Z0-9_-]*$'),
    Trim(),
  );
};
