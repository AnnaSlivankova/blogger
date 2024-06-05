import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/domain/user.entity';

@Entity()
export class Device {
  // @PrimaryGeneratedColumn('uuid')
  // public id: string;

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

  @Column({ type: 'timestamptz' })
  public lastActiveDate: Date;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  public rt: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
