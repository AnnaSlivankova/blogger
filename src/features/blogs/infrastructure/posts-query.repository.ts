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

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getPostById(id: string): Promise<PostOutputModel | null> {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['blog'],
      });
      return postOutputModelMapper(post);
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

      const [items, totalCount] = await this.postRepository.findAndCount({
        where: { blogId },
        relations: ['blog'],
        order: { [sortBy]: direction },
        skip: skip,
        take: pageSize,
      });

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

      const [items, totalCount] = await this.postRepository.findAndCount({
        relations: ['blog'],
        order: { [sortBy]: direction },
        skip: skip,
        take: pageSize,
      });

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
