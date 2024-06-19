import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CommentLikeStatus } from '../domain/comment-like-status.entity';

@Injectable()
export class LikesCommentRepository {
  constructor(
    @InjectRepository(CommentLikeStatus)
    private readonly commentLikeStatusRepository: Repository<CommentLikeStatus>,
  ) {}

  async save(dto: CommentLikeStatus): Promise<boolean> {
    try {
      const res = await this.commentLikeStatusRepository.save(dto);
      return !!res.id;
    } catch (e) {
      console.log('LikesCommentRepository/save', e);
      return false;
    }
  }

  async getCurrentStatus(
    userId: string,
    commentId: string,
  ): Promise<CommentLikeStatus | null> {
    try {
      const queryBuilder = this.commentLikeStatusRepository
        .createQueryBuilder('comment_like_status')
        .leftJoinAndSelect('comment_like_status.user', 'user')
        .leftJoinAndSelect('comment_like_status.comment', 'comment')
        .where('comment_like_status.user = :userId', { userId })
        .andWhere('comment_like_status.comment = :commentId', { commentId });

      return await queryBuilder.getOne();
    } catch (e) {
      console.log('LikesCommentRepository/getCurrentStatus', e);
      return null;
    }
  }
}
