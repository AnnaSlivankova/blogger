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

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async getById(id: string): Promise<CommentOutputModel | null> {
    try {
      const comment = await this.commentsRepository.findOne({ where: { id } });
      return commentOutputModelMapper(comment);
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
        .orderBy(sortBy, direction)
        .skip(skip)
        .take(pageSize);

      const [items, totalCount] = await queryBuilder.getManyAndCount();
      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        page: pageNumber,
        pageSize,
        pagesCount,
        totalCount,
        items: items.map((c) => commentOutputModelMapper(c)),
      };
    } catch (e) {
      console.log('CommentsQueryRepository/getAll', e);
      return null;
    }
  }
}
