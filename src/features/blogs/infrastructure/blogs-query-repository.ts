import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Blog } from '../domain/blog.entity';
import { Injectable } from '@nestjs/common';
import {
  BlogOutputModel,
  blogOutputModelMapper,
} from '../api/models/output/blog.output.model';
import {
  QueryParams,
  SortDirection,
} from '../../../infrastructure/models/query.params';
import { PaginationOutputModel } from '../../../infrastructure/models/pagination.output.model';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async getById(blogId: string): Promise<BlogOutputModel | null> {
    try {
      const blog = await this.blogRepository.findOne({ where: { id: blogId } });
      // console.log(blog);
      if (!blog) return null;

      return blogOutputModelMapper(blog);
    } catch (e) {
      console.log('BlogsQueryRepository/save', e);
      return null;
    }
  }

  async getAll(
    query: QueryParams,
  ): Promise<PaginationOutputModel<BlogOutputModel> | null> {
    try {
      const { searchNameTerm, pageSize, pageNumber, sortDirection, sortBy } =
        query;
      const skip = query.getSkipItemsCount();
      const name = searchNameTerm ? `%${searchNameTerm}%` : `%%`;
      const direction = sortDirection === SortDirection.ASC ? 'ASC' : 'DESC';

      const [items, totalCount] = await this.blogRepository.findAndCount({
        where: { name: ILike(`%${name}%`) },
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
        items: items.map((b) => blogOutputModelMapper(b)),
      };
    } catch (e) {
      console.log('BlogsQueryRepository/getAll', e);
      return null;
    }
  }
}
