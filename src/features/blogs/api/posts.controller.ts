import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
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
import { UserIdFromAcToken } from '../../../infrastructure/decorators/transform/userId-from-ac-token.decorator';
import { UserId } from '../../../infrastructure/decorators/transform/userId.decorator';
import { UpdatePostLikeStatusInputModel } from './models/input/update-post-like-status.input.model';
import { LikesPostService } from '../application/services/likes-post.service';

@Controller(PATH.POSTS)
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private likesPostService: LikesPostService,
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
  async getPost(
    @Param('id') id: string,
    @UserIdFromAcToken() userId: string | undefined,
  ): Promise<PostOutputModel> {
    const post = await this.postsQueryRepository.getPostById(id, userId);
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

    const comment = await this.commentsQueryRepository.getById(
      commentId,
      //userId,
    );
    if (!comment) throw new BadRequestException();

    res.status(201).send(comment);
    return;
  }

  @Get(':postId/comments')
  async getAllPostComments(
    @Param('postId') postId: string,
    @Query() query: QueryParams,
    @UserIdFromAcToken() userId: string | undefined,
  ): Promise<PaginationOutputModel<CommentOutputModel>> {
    const post = await this.postsQueryRepository.getPostById(postId);
    if (!post) throw new NotFoundException();

    const comments = await this.commentsQueryRepository.getAll(
      userId,
      postId,
      query,
    );
    if (!comments) throw new NotFoundException();

    return comments;
  }

  @UseGuards(AuthBearerGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async updatePostLikeStatus(
    @Param('postId') postId: string,
    @UserId() userId: string,
    @Body() inputDto: UpdatePostLikeStatusInputModel,
  ) {
    const isUpdated = await this.likesPostService.update(
      userId,
      postId,
      inputDto,
    );
    if (!isUpdated) throw new BadRequestException();

    return;
  }
}
