import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../infrastructure/entities/base.entity';
import { User } from '../../users/domain/user.entity';
import { LikeStatuses } from '../api/models/like-statuses.enum';
import { Post } from './post.entity';

@Entity()
export class PostLikeStatus extends BaseEntity {
  @Column({
    type: 'character varying',
    length: 10,
    nullable: true,
    collation: 'C',
  })
  public likeStatus: string;

  @ManyToOne(() => User, (u) => u.commentLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Post, (p) => p.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column({ type: 'uuid' })
  postId: string;

  get userLogin(): string {
    if (!this.user) return null;
    return this.user.login;
  }

  public static create(
    user: User,
    post: Post,
    data: {
      likeStatus: LikeStatuses;
    },
  ): PostLikeStatus {
    const pl = new PostLikeStatus();
    pl.user = user;
    pl.post = post;
    pl.likeStatus = data.likeStatus;

    return pl;
  }

  public update(data: { likeStatus: LikeStatuses }): PostLikeStatus {
    this.likeStatus = data.likeStatus;
    return this;
  }
}
