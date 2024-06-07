import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../infrastructure/entities/base.entity';

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

  public static create(data: any): Blog {
    const b = new Blog();

    return b;
  }
}
