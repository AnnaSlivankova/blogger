import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { Comment } from '../../domain/comment.entity';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { UpdateCommentInputModel } from '../../api/models/input/update-comment.input.model';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository,
  ) {}

  async create(dto: {
    userId: string;
    postId: string;
    content: string;
  }): Promise<string | null> {
    const { userId, postId, content } = dto;
    const user = await this.usersRepository.getUserById(userId);
    if (!user) throw new BadRequestException();

    const post = await this.postsRepository.getById(postId);
    if (!post) throw new NotFoundException();

    const comment = Comment.create(user, post, { content });
    return await this.commentsRepository.save(comment);
  }

  async update(
    userId: string,
    commentId: string,
    inputDto: UpdateCommentInputModel,
  ): Promise<boolean> {
    const comment = await this.commentsRepository.getById(commentId);
    if (!comment) throw new NotFoundException();
    if (userId !== comment.userId) throw new ForbiddenException();

    comment.update(inputDto);

    const updCommentId = await this.commentsRepository.save(comment);
    return !!updCommentId;
  }

  async delete(userId: string, commentId: string): Promise<boolean> {
    const comment = await this.commentsRepository.getById(commentId);
    if (!comment) throw new NotFoundException();
    if (userId !== comment.userId) throw new ForbiddenException();

    return await this.commentsRepository.delete(commentId);
  }
}
