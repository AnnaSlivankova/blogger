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
export class EmailConfirmation {
  @PrimaryColumn({ type: 'uuid' })
  public userId: string;
  @OneToOne(() => User, (u) => u.emailConfirmation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column({
    type: 'character varying',
    nullable: true,
    collation: 'C',
  })
  public confirmationCode: string;

  @Column({ type: 'timestamptz', nullable: true })
  public expirationDate: Date;

  @Column({ type: 'boolean', nullable: false })
  public isConfirmed: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  public static create(user: User, isConfirmed = false): EmailConfirmation {
    const ec = new EmailConfirmation();
    ec.user = user;
    ec.isConfirmed = isConfirmed;

    if (isConfirmed) {
      ec.confirmationCode = null;
      ec.expirationDate = null;
    } else {
      ec.confirmationCode = crypto.randomUUID();
      ec.expirationDate = add(new Date(), {
        hours: 1,
        seconds: 5,
      });
    }

    return ec;
  }

  public async confirmStatus(): Promise<EmailConfirmation> {
    if (this.isAlreadyConfirmed)
      throw new Error('Email had already been confirmed');
    if (this.isExpired) throw new Error('Confirmation code expired');

    this.isConfirmed = true;
    this.expirationDate = null;
    this.confirmationCode = null;

    return this;
  }

  get isExpired(): boolean {
    return this.expirationDate < new Date();
  }

  get isAlreadyConfirmed(): boolean {
    return this.isConfirmed;
  }

  get confCode(): string {
    return this.confirmationCode;
  }
}
