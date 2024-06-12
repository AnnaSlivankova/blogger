import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../infrastructure/entities/base.entity';
import { Blog } from './blog.entity';
import { Comment } from './comment.entity';

@Entity()
export class Post extends BaseEntity {
  @Column({
    type: 'character varying',
    length: 30,
    nullable: false,
    collation: 'C',
  })
  public title: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
    collation: 'C',
  })
  public shortDescription: string;

  @Column({
    type: 'character varying',
    length: 1000,
    nullable: false,
    collation: 'C',
  })
  public content: string;

  @ManyToOne(() => Blog, (b) => b.posts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @Column()
  blogId: string;

  @OneToMany(() => Comment, (c) => c.user)
  comments: Comment[];

  public static create(
    blog: Blog,
    data: {
      title: string;
      shortDescription: string;
      content: string;
    },
  ): Post {
    const p = new Post();
    p.blog = blog;
    p.title = data.title;
    p.shortDescription = data.shortDescription;
    p.content = data.content;

    return p;
  }
}
