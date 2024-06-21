import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UpdateCommentLikeStatusInputModel } from '../../api/models/input/update-comment-like-status.input.model';
import { LikesCommentRepository } from '../../infrastructure/likes-comment.repository';
import { CommentLikeStatus } from '../../domain/comment-like-status.entity';
import { CommentsRepository } from '../../infrastructure/comments.repository';

@Injectable()
export class LikesCommentService {
  constructor(
    private usersRepository: UsersRepository,
    private commentsRepository: CommentsRepository,
    private likesCommentRepository: LikesCommentRepository,
  ) {}

  async update(
    userId: string,
    commentId: string,
    inputDto: UpdateCommentLikeStatusInputModel,
  ): Promise<boolean> {
    const comment = await this.commentsRepository.getById(commentId);
    if (!comment) throw new NotFoundException();

    const user = await this.usersRepository.getUserById(userId);
    if (!user) throw new BadRequestException();

    const currentLikeStatus =
      await this.likesCommentRepository.getCurrentStatus(userId, commentId);

    if (!currentLikeStatus) {
      const commentLike = CommentLikeStatus.create(user, comment, inputDto);
      return await this.likesCommentRepository.save(commentLike);
    } else {
      currentLikeStatus.update(inputDto);

      return await this.likesCommentRepository.save(currentLikeStatus);
    }
  }
}
