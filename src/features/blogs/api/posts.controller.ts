import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { PATH } from 'src/settings/app.settings';
import { QueryParams } from '../../../infrastructure/models/query.params';
import { PaginationOutputModel } from '../../../infrastructure/models/pagination.output.model';
import { PostOutputModel } from './models/output/post.output.model';
import { PostsQueryRepository } from '../infrastructure/posts-query.repository';

@Controller(PATH.POSTS)
export class PostsController {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  @Get()
  async getAllPosts(
    @Query() query: QueryParams,
  ): Promise<PaginationOutputModel<PostOutputModel>> {
    const posts = await this.postsQueryRepository.getAll(query);
    if (!posts) throw new BadRequestException();
    return posts;
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostOutputModel> {
    const post = await this.postsQueryRepository.getPostById(id);
    if (!post) throw new NotFoundException();

    return post;
  }
}
