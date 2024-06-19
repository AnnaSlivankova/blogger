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
import { getLogger } from 'nodemailer/lib/shared';

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
      const queryBuilderForComment = this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post')
        .where('comment.id = :id', { id });
      if (userId) {
        queryBuilderForComment.addSelect((qb) =>
          qb
            .select()
            .from('comment.likes', 'like')
            .where('like.userId = :userId', { userId }),
        );
        // .leftJoinAndSelect('comment.likes', 'like')
        // .andWhere('like.userId = :userId', { userId })
        // .distinct(true);
      }

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

      const result = await queryBuilderForComment.getOne();

      const rawCount = await queryBuilderForCount.getRawOne();
      const likes = +rawCount.likeCount;
      const dislikes = +rawCount.dislikeCount;
      console.log(result, ' result');
      const comment = result.likes ? result : { ...result, likes: [] };

      return commentOutputModelMapper(comment as Comment, likes, dislikes);
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

      const queryBuilder = this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post')
        .leftJoinAndMapMany(
          'comment.likes',
          'comment.likes',
          'like',
          userId ? 'like.userId = :userId' : '1=1',
          { userId },
        )
        .where('comment.postId = :postId', { postId })
        .orderBy(`comment.${sortBy}`, direction)
        .skip(skip)
        .take(pageSize);

      const [items, totalCount] = await queryBuilder.getManyAndCount();

      const commentIds = items.map((c) => c.id);

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
      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        page: pageNumber,
        pageSize,
        pagesCount,
        totalCount,
        items: items.map((c) => {
          const likeDislikeCounts = rawLikes.filter(
            (el) => el.commentId === c.id,
          );
          return commentOutputModelMapper(
            c,
            +likeDislikeCounts[0].likeCount || 0,
            +likeDislikeCounts[0].dislikeCount || 0,
          );
        }),
      };
    } catch (e) {
      console.log('CommentsQueryRepository/getAll', e);
      return null;
    }
  }
}
