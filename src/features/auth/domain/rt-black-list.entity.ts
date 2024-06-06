import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RtBlackList {
  @PrimaryColumn({ type: 'character varying', nullable: false })
  public refreshToken: string;

  @CreateDateColumn()
  public createdAt: Date;

  public static create(refreshToken: string): RtBlackList {
    const entity = new RtBlackList();
    entity.refreshToken = refreshToken;

    return entity;
  }
}
