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
import { LikeStatuses } from '../api/models/like-statuses.enum';

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
        .leftJoinAndSelect('comment.post', 'post');
      if (userId) {
        queryBuilderForComment.addSelect(
          (qb) =>
            qb
              .select('like.likeStatus')
              .from(CommentLikeStatus, 'like')
              .where('like.userId = :userId', { userId })
              .andWhere('comment.id = like.commentId'),
          'likeStatus',
        );
        queryBuilderForComment.where('comment.id = :id', { id });
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

      const result = await queryBuilderForComment.getRawOne();
      console.log(result, 'res');

      const rawCount = await queryBuilderForCount.getRawOne();
      const likes = +rawCount.likeCount;
      const dislikes = +rawCount.dislikeCount;

      return commentOutputModelMapper(
        result,
        likes,
        dislikes,
        result.likeStatus ?? LikeStatuses.NONE,
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
      console.log('userId', userId);
      const { pageSize, pageNumber, sortDirection, sortBy } = query;
      const skip = query.getSkipItemsCount();
      const direction = sortDirection === SortDirection.ASC ? 'ASC' : 'DESC';

      const queryBuilder = this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post');
      if (userId) {
        queryBuilder.addSelect(
          (qb) =>
            qb
              .select('like.likeStatus')
              .from(CommentLikeStatus, 'like')
              .andWhere('comment.id = like.commentId'),
          'likeStatus',
        );
      }
      //
      // .leftJoinAndMapMany(
      //   'comment.likes',
      //   'comment.likes',
      //   'like',
      //   userId ? 'like.userId = :userId' : '1=1',
      //   { userId },
      // )
      // .leftJoinAndMapMany(
      //   'comment.likes',
      //   'comment.likes',
      //   'like',
      //   // Conditionally include userId in the join condition
      //   userId
      //     ? 'like.userId = :userId AND like.commentId = comment.id'
      //     : '1=1',
      //   { userId },
      // )
      queryBuilder
        .where('comment.postId = :postId', { postId })
        .orderBy(`comment.${sortBy}`, direction)
        .skip(skip)
        .take(pageSize);

      const [items, totalCount] = await queryBuilder.getManyAndCount();
      const res = await queryBuilder.getRawAndEntities();
      const entities = res.entities;
      const test = res.entities.length;
      const totalCountEntities = await queryBuilder.getCount();
      const likes = res.raw;

      // console.log('entities', entities);
      // console.log('test', test);
      // console.log('totalCountEntities', totalCountEntities);
      // console.log('totalCount', totalCount);
      // console.log('likes', likes);

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
        items: res.raw.map((rc) => {
          const likeDislikeCounts = rawLikes.filter(
            (el) => el.commentId === rc.comment_id,
          );
          console.log(likeDislikeCounts);
          return commentOutputModelMapper(
            rc,
            +likeDislikeCounts[0].likeCount || 0,
            +likeDislikeCounts[0].dislikeCount || 0,
            rc.likeStatus ?? LikeStatuses.NONE,
          );
        }),
        // items: items.map((c) => {
        //   const likeDislikeCounts = rawLikes.filter(
        //     (el) => el.commentId === c.id,
        //   );
        //   return commentOutputModelMapper(
        //     c,
        //     +likeDislikeCounts[0].likeCount || 0,
        //     +likeDislikeCounts[0].dislikeCount || 0,
        //   );
        // }),
      };
    } catch (e) {
      console.log('CommentsQueryRepository/getAll', e);
      return null;
    }
  }
}
