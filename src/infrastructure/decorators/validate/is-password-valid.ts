import { applyDecorators } from '@nestjs/common/decorators';
import { IsDefined, IsString, Length } from 'class-validator';
import { Trim } from '../transform/trim';

export const IsPasswordValid = () => {
  return applyDecorators(
    IsDefined(),
    IsString(),
    Length(6, 20, { message: 'password is not correct' }),
    Trim(),
  );
};
