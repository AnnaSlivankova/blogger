import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../infrastructure/entities/base.entity';
import { Comment } from './comment.entity';
import { User } from '../../users/domain/user.entity';
import { LikeStatuses } from '../api/models/like-statuses.enum';

@Entity()
export class CommentLikeStatus extends BaseEntity {
  @Column({
    type: 'character varying',
    length: 10,
    nullable: false,
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

  @ManyToOne(() => Comment, (c) => c.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @Column({ type: 'uuid' })
  commentId: string;

  get userLogin(): string {
    if (!this.user) return null;
    return this.user.login;
  }

  public static create(
    user: User,
    comment: Comment,
    data: {
      likeStatus: LikeStatuses;
    },
  ): CommentLikeStatus {
    const cl = new CommentLikeStatus();
    cl.user = user;
    cl.comment = comment;
    cl.likeStatus = data.likeStatus;

    return cl;
  }

  public update(data: { likeStatus: LikeStatuses }): CommentLikeStatus {
    this.likeStatus = data.likeStatus;
    return this;
  }
}
