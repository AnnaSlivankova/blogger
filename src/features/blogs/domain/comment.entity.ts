import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../infrastructure/entities/base.entity';
import { Post } from './post.entity';
import { User } from '../../users/domain/user.entity';
import { CommentLikeStatus } from './comment-like-status.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column({
    type: 'character varying',
    length: 300,
    nullable: false,
    collation: 'C',
  })
  public content: string;

  @ManyToOne(() => User, (u) => u.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Post, (p) => p.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Post;
  @Column()
  postId: string;

  @OneToMany(() => CommentLikeStatus, (cl) => cl.comment)
  likes: CommentLikeStatus[];

  public static create(
    user: User,
    post: Post,
    data: {
      content: string;
    },
  ): Comment {
    const c = new Comment();
    c.user = user;
    c.post = post;
    c.content = data.content;

    return c;
  }

  public update(data: { content: string }): Comment {
    this.content = data.content;

    return this;
  }
}
