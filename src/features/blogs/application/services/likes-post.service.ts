import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { LikesPostRepository } from '../../infrastructure/likes-post.repository';
import { UpdatePostLikeStatusInputModel } from '../../api/models/input/update-post-like-status.input.model';
import { PostLikeStatus } from '../../domain/post-like-status.entity';

@Injectable()
export class LikesPostService {
  constructor(
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository,
    private likesPostRepository: LikesPostRepository,
  ) {}

  async update(
    userId: string,
    postId: string,
    inputDto: UpdatePostLikeStatusInputModel,
  ): Promise<boolean> {
    const post = await this.postsRepository.getById(postId);
    if (!post) throw new NotFoundException();

    const user = await this.usersRepository.getUserById(userId);
    if (!user) throw new BadRequestException();

    const currentLikeStatus = await this.likesPostRepository.getCurrentStatus(
      userId,
      postId,
    );

    if (!currentLikeStatus) {
      const postLike = PostLikeStatus.create(user, post, inputDto);
      return await this.likesPostRepository.save(postLike);
    } else {
      currentLikeStatus.update(inputDto);
      return await this.likesPostRepository.save(currentLikeStatus);
    }
  }
}
