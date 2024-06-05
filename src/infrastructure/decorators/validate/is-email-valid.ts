import { applyDecorators } from '@nestjs/common/decorators';
import { IsDefined, IsString, Matches } from 'class-validator';
import { Trim } from '../transform/trim';

export const IsEmailValid = () => {
  return applyDecorators(
    IsDefined(),
    IsString(),
    Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
    Trim(),
  );
};
