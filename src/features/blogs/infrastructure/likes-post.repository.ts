import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PostLikeStatus } from '../domain/post-like-status.entity';

@Injectable()
export class LikesPostRepository {
  constructor(
    @InjectRepository(PostLikeStatus)
    private readonly postLikeStatusRepository: Repository<PostLikeStatus>,
  ) {}

  async save(dto: PostLikeStatus): Promise<boolean> {
    try {
      const res = await this.postLikeStatusRepository.save(dto);
      return !!res.id;
    } catch (e) {
      console.log('LikesPostRepository/save', e);
      return false;
    }
  }

  async getCurrentStatus(
    userId: string,
    postId: string,
  ): Promise<PostLikeStatus | null> {
    try {
      const queryBuilder = this.postLikeStatusRepository
        .createQueryBuilder('post_like_status')
        .leftJoinAndSelect('post_like_status.user', 'user')
        .leftJoinAndSelect('post_like_status.post', 'post')
        .where('post_like_status.user = :userId', { userId })
        .andWhere('post_like_status.post = :postId', { postId });

      return await queryBuilder.getOne();
    } catch (e) {
      console.log('LikesPostRepository/getCurrentStatus', e);
      return null;
    }
  }
}
