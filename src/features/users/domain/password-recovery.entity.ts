import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { add } from 'date-fns';
import crypto from 'crypto';

@Entity()
export class PasswordRecovery {
  @PrimaryColumn({ type: 'uuid' })
  public userId: string;
  @OneToOne(() => User, (u) => u.passwordRecovery, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column({ type: 'character varying', nullable: true, collation: 'C' })
  public recoveryCode: string;

  @Column({ type: 'timestamptz', nullable: true })
  public expirationDate: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  public static create(user: User): PasswordRecovery {
    const pc = new PasswordRecovery();
    pc.user = user;
    pc.recoveryCode = crypto.randomUUID();
    pc.expirationDate = add(new Date(), {
      hours: 1,
      seconds: 5,
    });

    return pc;
  }

  get isExpired(): boolean {
    return this.expirationDate < new Date();
  }
}
