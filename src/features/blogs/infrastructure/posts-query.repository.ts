import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Post } from '../domain/post.entity';
import {
  PostOutputModel,
  postOutputModelMapper,
} from '../api/models/output/post.output.model';
import {
  QueryParams,
  SortDirection,
} from '../../../infrastructure/models/query.params';
import { PaginationOutputModel } from '../../../infrastructure/models/pagination.output.model';
import { PostLikeStatus } from '../domain/post-like-status.entity';
import { User } from '../../users/domain/user.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getPostById(
    id: string,
    userId?: string | undefined,
  ): Promise<PostOutputModel | null> {
    try {
      //qb to get post with myStatus and last 3 likes in arr
      const queryBuilderForPost = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.blog', 'blog')
        .select(['blog.name AS "blogName"', 'post.*']);

      if (userId) {
        queryBuilderForPost.addSelect(
          (qb) =>
            qb
              .select('like.likeStatus')
              .from(PostLikeStatus, 'like')
              .where('like.userId = :userId', { userId })
              .andWhere('post.id = like.postId'),
          'myStatus',
        );
      }

      queryBuilderForPost
        .addSelect(
          (qb) =>
            qb
              .select(
                `jsonb_agg(json_build_object('addedAt', to_char(
            agg."createdAt"::timestamp at time zone 'UTC',
            'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), 'userId', cast(agg.id as varchar), 'login', agg.login)
                 )`,
              )
              .from((qb) => {
                return qb
                  .select(`"pl"."createdAt", u.id, u.login`)
                  .from(PostLikeStatus, 'pl')
                  .leftJoin('pl.user', 'u')
                  .where('pl.postId = post.id')
                  .andWhere(`pl.likeStatus = 'Like'`)
                  .orderBy('"createdAt"', 'DESC')
                  .limit(3);
              }, 'agg'),

          'newestLikes',
        )
        .where('post.id = :postId', { postId: id });

      //qb to get likes/dislikes count
      const queryBuilderForCount = this.postRepository
        .createQueryBuilder('post')
        .leftJoin('post.likes', 'post_like_status')
        .select('post.id', 'postId')
        .addSelect(
          'SUM(CASE WHEN post_like_status.likeStatus = :likeStatus THEN 1 ELSE 0 END)',
          'likeCount',
        )
        .addSelect(
          'SUM(CASE WHEN post_like_status.likeStatus = :dislikeStatus THEN 1 ELSE 0 END)',
          'dislikeCount',
        )
        .where('post.id = :postId', { postId: id })
        .setParameter('likeStatus', 'Like')
        .setParameter('dislikeStatus', 'Dislike')
        .groupBy('post.id');

      const postRes = await queryBuilderForPost.getRawOne();
      const countRes = await queryBuilderForCount.getRawOne();
      const likes = +countRes.likeCount;
      const dislikes = +countRes.dislikeCount;

      return postOutputModelMapper(postRes, likes, dislikes);
    } catch (e) {
      console.log('PostsQueryRepository/getPostById', e);
      return null;
    }
  }

  async getAllByBlogId(
    blogId: string,
    query: QueryParams,
  ): Promise<PaginationOutputModel<PostOutputModel> | null> {
    try {
      const { pageSize, pageNumber, sortDirection, sortBy } = query;
      const skip = query.getSkipItemsCount();
      const direction = sortDirection === SortDirection.ASC ? 'ASC' : 'DESC';

      const isBlogField = sortBy.includes('blogName');
      const sortField = isBlogField ? 'blog.name' : `post.${sortBy}`;

      const queryBuilder = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.blog', 'blog')
        .orderBy(sortField, direction)
        .skip(skip)
        .take(pageSize);

      const [items, totalCount] = await queryBuilder.getManyAndCount();
      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        page: pageNumber,
        pageSize,
        pagesCount,
        totalCount,
        items: items.map((p) => postOutputModelMapper(p)),
      };
    } catch (e) {
      console.log('PostsQueryRepository/getAllByBlogId', e);
      return null;
    }
  }

  async getAll(
    query: QueryParams,
  ): Promise<PaginationOutputModel<PostOutputModel> | null> {
    try {
      const { pageSize, pageNumber, sortDirection, sortBy } = query;
      const skip = query.getSkipItemsCount();
      const direction = sortDirection === SortDirection.ASC ? 'ASC' : 'DESC';

      const isBlogField = sortBy.includes('blogName');
      const sortField = isBlogField ? 'blog.name' : `post.${sortBy}`;

      const queryBuilder = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.blog', 'blog')
        .orderBy(sortField, direction)
        .skip(skip)
        .take(pageSize);

      const [items, totalCount] = await queryBuilder.getManyAndCount();
      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        page: pageNumber,
        pageSize,
        pagesCount,
        totalCount,
        items: items.map((p) => postOutputModelMapper(p)),
      };
    } catch (e) {
      console.log('PostsQueryRepository/getAll', e);
      return null;
    }
  }
}
