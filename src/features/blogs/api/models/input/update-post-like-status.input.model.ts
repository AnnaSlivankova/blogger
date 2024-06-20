import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsDefined, IsEnum } from 'class-validator';
import { LikeStatuses } from '../like-statuses.enum';

export class UpdatePostLikeStatusInputModel {
  @Trim()
  @IsEnum(LikeStatuses, {
    message: 'incorrect value (use: None, Like or Dislike instead)',
  })
  @IsDefined()
  likeStatus: LikeStatuses;
}
