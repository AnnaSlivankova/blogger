import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthBasicGuard } from '../../../infrastructure/guards/auth.basic.guard';
import { PATH } from 'src/settings/app.settings';
import { BlogsService } from '../application/services/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs-query-repository';
import { CreateBlogInputModel } from './models/input/create-blog.input.model';
import { BlogOutputModel } from './models/output/blog.output.model';
import { UpdateBlogInputModel } from './models/input/update-blog.input.model';
import { QueryParams } from '../../../infrastructure/models/query.params';
import { PaginationOutputModel } from '../../../infrastructure/models/pagination.output.model';
import { PostOutputModel } from './models/output/post.output.model';
import { CreatePostInputModel } from './models/input/create-post.input.model';
import { PostsQueryRepository } from '../infrastructure/posts-query.repository';
import { UpdatePostInputModel } from './models/input/update-post.input.model';

@UseGuards(AuthBasicGuard)
@Controller(PATH.BLOGS_SA)
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  async createBlog(
    @Body() inputDto: CreateBlogInputModel,
  ): Promise<BlogOutputModel> {
    const blogId = await this.blogsService.create(inputDto);
    if (!blogId) throw new BadRequestException();

    const blog = await this.blogsQueryRepository.getById(blogId);
    if (!blog) throw new BadRequestException();

    return blog;
  }

  @Put(':id')
  async updateBlog(
    @Param('id') id: string,
    @Body() inputDto: UpdateBlogInputModel,
  ) {
    const isUpdated = await this.blogsService.update(id, inputDto);
    if (!isUpdated) throw new BadRequestException();
    return;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const isDeleted = await this.blogsService.delete(id);
    if (!isDeleted) throw new BadRequestException();
    return;
  }

  @Get()
  async getAllBlogs(
    @Query() query: QueryParams,
  ): Promise<PaginationOutputModel<BlogOutputModel>> {
    const blogs = await this.blogsQueryRepository.getAll(query);
    if (!blogs) throw new BadRequestException();
    return blogs;
  }

  @Post(':blogId/posts')
  async createPostToBlog(
    @Param('blogId') blogId: string,
    @Body() inputDto: CreatePostInputModel,
  ): Promise<PostOutputModel> {
    const postId = await this.blogsService.createPostToBlog(blogId, inputDto);
    if (!postId) throw new BadRequestException();

    const post = await this.postsQueryRepository.getPostById(postId);
    if (!post) throw new BadRequestException();

    return post;
  }

  @Put(':blogId/posts/:postId')
  async updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() inputDto: UpdatePostInputModel,
  ) {
    const isUpdated = await this.blogsService.updatePost(
      blogId,
      postId,
      inputDto,
    );
    if (!isUpdated) throw new BadRequestException();
    return;
  }

  @Delete(':blogId/posts/:postId')
  async deletePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ) {
    const isDeleted = await this.blogsService.deletePost(blogId, postId);
    if (!isDeleted) throw new BadRequestException();
    return;
  }

  @Get(':blogId/posts')
  async getAllPostsForBlog(
    @Param('blogId') blogId: string,
    @Query() query: QueryParams,
  ): Promise<PaginationOutputModel<PostOutputModel>> {
    // const blog = await this.blogsQueryRepository.getById(blogId);
    // if (!blog) throw new NotFoundException();

    const posts = await this.postsQueryRepository.getAll(blogId, query);
    //todo check if blogId is invalid
    if (!posts) throw new NotFoundException();
    return posts;
  }
}
