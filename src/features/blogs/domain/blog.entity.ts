import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../infrastructure/entities/base.entity';
import { Post } from './post.entity';

@Entity()
export class Blog extends BaseEntity {
  @Column({
    type: 'character varying',
    length: 15,
    nullable: false,
    collation: 'C',
  })
  public name: string;

  @Column({
    type: 'character varying',
    length: 500,
    nullable: false,
  })
  public description: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
    collation: 'C',
  })
  public websiteUrl: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  public isMembership: boolean;

  @OneToMany(() => Post, (p) => p.blog)
  posts: Post[];

  public static create(data: {
    name: string;
    description: string;
    websiteUrl: string;
  }): Blog {
    const b = new Blog();
    b.name = data.name;
    b.description = data.description;
    b.websiteUrl = data.websiteUrl;

    return b;
  }

  public update(data: {
    name: string;
    description: string;
    websiteUrl: string;
  }): Blog {
    this.name = data.name;
    this.description = data.description;
    this.websiteUrl = data.websiteUrl;

    return this;
  }
}
