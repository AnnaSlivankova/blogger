import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/domain/user.entity';
import crypto from 'crypto';

@Entity()
export class Device {
  @PrimaryColumn({ type: 'uuid' })
  public deviceId: string;

  @ManyToOne(() => User, (u) => u.devices, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  public ip: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  public userAgent: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  public rt: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  public static create(user: User, ip: string, userAgent: string): Device {
    const d = new Device();
    d.user = user;
    d.deviceId = crypto.randomUUID();
    d.userAgent = userAgent ? userAgent : 'unknown';
    d.ip = ip ? ip : 'unknown';

    return d;
  }
}
