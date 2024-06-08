import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { PATH } from 'src/settings/app.settings';
import { BlogsQueryRepository } from '../infrastructure/blogs-query-repository';
import { BlogOutputModel } from './models/output/blog.output.model';
import { QueryParams } from '../../../infrastructure/models/query.params';
import { PaginationOutputModel } from '../../../infrastructure/models/pagination.output.model';
import { PostOutputModel } from './models/output/post.output.model';
import { PostsQueryRepository } from '../infrastructure/posts-query.repository';

@Controller(PATH.BLOGS)
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(
    @Query() query: QueryParams,
  ): Promise<PaginationOutputModel<BlogOutputModel>> {
    const blogs = await this.blogsQueryRepository.getAll(query);
    if (!blogs) throw new BadRequestException();
    return blogs;
  }

  @Get(':blogId/posts')
  async getAllPostsForBlog(
    @Param('blogId') blogId: string,
    @Query() query: QueryParams,
  ): Promise<PaginationOutputModel<PostOutputModel>> {
    // const blog = await this.blogsQueryRepository.getById(blogId);
    // if (!blog) throw new NotFoundException();

    const posts = await this.postsQueryRepository.getAllByBlogId(blogId, query);
    //todo check if blogId is invalid
    if (!posts) throw new NotFoundException();
    return posts;
  }

  @Get(':id')
  async getBlog(@Param('id') id: string): Promise<BlogOutputModel> {
    const blog = await this.blogsQueryRepository.getById(id);
    if (!blog) throw new NotFoundException();

    return blog;
  }
}
