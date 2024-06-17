import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PATH } from 'src/settings/app.settings';
import { CommentOutputModel } from './models/output/comment.output.model';
import { CommentsQueryRepository } from '../infrastructure/comments-query.repository';
import { UpdateCommentInputModel } from './models/input/update-comment.input.model';
import { CommentsService } from '../application/services/comments.service';
import { UserIdFromAcToken } from '../../../infrastructure/decorators/transform/userId-from-ac-token.decorator';
import { AuthBearerGuard } from '../../../infrastructure/guards/auth.bearer.guard';
import { UserId } from '../../../infrastructure/decorators/transform/userId.decorator';

@Controller(PATH.COMMENTS)
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsService: CommentsService,
  ) {}

  @Get(':id')
  async getCommentById(
    @Param('id') id: string,
    @UserIdFromAcToken() userId: string | undefined,
  ): Promise<CommentOutputModel> {
    const comment = await this.commentsQueryRepository.getById(id);
    if (!comment) throw new NotFoundException();

    return comment;
  }

  @UseGuards(AuthBearerGuard)
  @Put(':commentId')
  @HttpCode(204)
  async updateComment(
    @Param('commentId') commentId: string,
    @UserId() userId: string,
    @Body() inputDto: UpdateCommentInputModel,
  ) {
    const isUpdated = await this.commentsService.update(
      userId,
      commentId,
      inputDto,
    );
    if (!isUpdated) throw new BadRequestException();

    return;
  }

  @UseGuards(AuthBearerGuard)
  @Delete(':commentId')
  @HttpCode(204)
  async deleteComment(
    @Param('commentId') commentId: string,
    @UserId() userId: string,
  ) {
    const isDeleted = await this.commentsService.delete(userId, commentId);
    if (!isDeleted) throw new BadRequestException();

    return;
  }
}
