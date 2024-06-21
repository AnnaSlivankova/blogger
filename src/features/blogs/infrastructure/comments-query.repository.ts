import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Comment } from '../domain/comment.entity';
import {
  CommentOutputModel,
  commentOutputModelMapper,
} from '../api/models/output/comment.output.model';
import { PaginationOutputModel } from '../../../infrastructure/models/pagination.output.model';
import {
  QueryParams,
  SortDirection,
} from '../../../infrastructure/models/query.params';
import { CommentLikeStatus } from '../domain/comment-like-status.entity';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async getById(
    id: string,
    userId?: string | undefined,
  ): Promise<CommentOutputModel | null> {
    try {
      //qb to get comment with myStatus
      const queryBuilderForComment = this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .select(['comment.*', 'user.login AS "userLogin"']);
      if (userId) {
        queryBuilderForComment.addSelect(
          (qb) =>
            qb
              .select('like.likeStatus')
              .from(CommentLikeStatus, 'like')
              .where('like.userId = :userId', { userId })
              .andWhere('comment.id = like.commentId'),
          'myStatus',
        );
      }
      queryBuilderForComment.where('comment.id = :id', { id });

      //qb to get likes/dislikes count
      const queryBuilderForCount = this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoin('comment.likes', 'comment_like_status')
        .select('comment.id', 'commentId')
        .addSelect(
          'SUM(CASE WHEN comment_like_status.likeStatus = :likeStatus THEN 1 ELSE 0 END)',
          'likeCount',
        )
        .addSelect(
          'SUM(CASE WHEN comment_like_status.likeStatus = :dislikeStatus THEN 1 ELSE 0 END)',
          'dislikeCount',
        )
        .where('comment.id = :commentId', { commentId: id })
        .setParameter('likeStatus', 'Like')
        .setParameter('dislikeStatus', 'Dislike')
        .groupBy('comment.id');

      const rawComment = await queryBuilderForComment.getRawOne();
      const rawCount = await queryBuilderForCount.getRawOne();

      return commentOutputModelMapper(
        rawComment,
        +rawCount.likeCount,
        +rawCount.dislikeCount,
      );
    } catch (e) {
      console.log('CommentsQueryRepository/getById', e);
      return null;
    }
  }

  async getAll(
    userId: string | undefined,
    postId: string,
    query: QueryParams,
  ): Promise<PaginationOutputModel<CommentOutputModel> | null> {
    try {
      const { pageSize, pageNumber, sortDirection, sortBy } = query;
      const skip = query.getSkipItemsCount();
      const direction = sortDirection === SortDirection.ASC ? 'ASC' : 'DESC';

      //qb to get all post comments with myStatus
      const queryBuilderForComment = this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post')
        .select([
          'comment.*',
          'user.login AS "userLogin"',
          'COUNT(*) OVER() AS "totalCount"',
        ]);
      if (userId) {
        queryBuilderForComment.addSelect(
          (qb) =>
            qb
              .select('like.likeStatus')
              .from(CommentLikeStatus, 'like')
              .where('like.userId = :userId', { userId })
              .andWhere('comment.id = like.commentId'),
          'myStatus',
        );
      }
      queryBuilderForComment
        .where('comment.postId = :postId', { postId })
        .orderBy(`comment.${sortBy}`, direction)
        .offset(skip)
        .limit(pageSize);

      const rawComments = await queryBuilderForComment.getRawMany();
      const totalCount = +rawComments[0].totalCount || 0;
      const pagesCount = Math.ceil(totalCount / pageSize);
      const commentIds = rawComments.map((c) => c.id);

      //qb to get likes/dislikes count
      const queryBuilderForCount = this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoin('comment.likes', 'comment_like_status')
        .select('comment.id', 'commentId')
        .addSelect(
          'SUM(CASE WHEN comment_like_status.likeStatus = :likeStatus THEN 1 ELSE 0 END)',
          'likeCount',
        )
        .addSelect(
          'SUM(CASE WHEN comment_like_status.likeStatus = :dislikeStatus THEN 1 ELSE 0 END)',
          'dislikeCount',
        )
        .where('comment.id IN (:...commentIds)', { commentIds })
        .setParameter('commentId', 'commentId')
        .setParameter('likeStatus', 'Like')
        .setParameter('dislikeStatus', 'Dislike')
        .groupBy('comment.id');

      const rawLikes = await queryBuilderForCount.getRawMany();

      const coll = new Map();
      rawLikes.forEach((item) => {
        coll.set(item.commentId, {
          likesCount: item.likeCount,
          dislikesCount: item.dislikeCount,
        });
      });

      return {
        page: pageNumber,
        pageSize,
        pagesCount,
        totalCount,
        items: rawComments.map((c) => {
          const likesInfo = coll.get(c.id);
          return commentOutputModelMapper(
            c,
            +likesInfo.likesCount,
            +likesInfo.dislikesCount,
          );
        }),
      };
    } catch (e) {
      console.log('CommentsQueryRepository/getAll', e);
      return null;
    }
  }
}
