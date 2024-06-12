import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PATH } from 'src/settings/app.settings';
import { QueryParams } from '../../../infrastructure/models/query.params';
import { PaginationOutputModel } from '../../../infrastructure/models/pagination.output.model';
import { PostOutputModel } from './models/output/post.output.model';
import { PostsQueryRepository } from '../infrastructure/posts-query.repository';
import { CommentsService } from '../application/services/comments.service';
import { CreateCommentInputModel } from './models/input/create-comment.input.model';
import { CommentOutputModel } from './models/output/comment.output.model';
import { CommentsQueryRepository } from '../infrastructure/comments-query.repository';
import { AuthBearerGuard } from '../../../infrastructure/guards/auth.bearer.guard';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from '../../../infrastructure/guards/refresh.token.guard';

@Controller(PATH.POSTS)
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

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

  @UseGuards(AuthBearerGuard)
  @Post(':postId/comments')
  async createCommentToPost(
    @Param('postId') postId: string,
    @Body() inputDto: CreateCommentInputModel,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<CommentOutputModel> {
    const userId = req['userId'];
    const commentId = await this.commentsService.create({
      postId,
      userId,
      content: inputDto.content,
    });
    if (!commentId) throw new BadRequestException();

    const comment = await this.commentsQueryRepository.getById(commentId);
    if (!comment) throw new BadRequestException();

    res.status(201).send(comment);
    return;
  }

  @UseGuards(RefreshTokenGuard)
  @Get(':postId/comments')
  async getAllPostComments(
    @Param('postId') postId: string,
    @Query() query: QueryParams,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<PaginationOutputModel<CommentOutputModel>> {
    const userId: string | undefined = req['userId'];
    const comments = await this.commentsQueryRepository.getAll(
      userId,
      postId,
      query,
    );
    if (!comments) throw new NotFoundException();

    res.status(200).send(comments);
    return;
  }
}
