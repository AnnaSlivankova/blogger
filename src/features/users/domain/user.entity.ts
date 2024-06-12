import { Column, Entity, OneToMany, OneToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../infrastructure/entities/base.entity';
import { PasswordRecovery } from './password-recovery.entity';
import { EmailConfirmation } from './email-confirmation.entity';
import { Device } from '../../auth/domain/device.entity';
import { Comment } from '../../blogs/domain/comment.entity';

@Entity()
@Unique(['login', 'email'])
export class User extends BaseEntity {
  @Column({
    type: 'character varying',
    length: 10,
    nullable: false,
    collation: 'C',
  })
  public login: string;

  @Column({
    type: 'character varying',
    length: 200,
    nullable: false,
    collation: 'C',
  })
  public email: string;

  @Column({
    type: 'character varying',
    length: 200,
    nullable: false,
    collation: 'C',
  })
  public hash: string;

  @OneToOne(() => EmailConfirmation, (ec) => ec.user)
  public emailConfirmation: EmailConfirmation;

  @OneToOne(() => PasswordRecovery, (pr) => pr.user)
  public passwordRecovery: PasswordRecovery;

  @OneToMany(() => Device, (d) => d.user)
  devices: Device[];

  @OneToMany(() => Comment, (c) => c.user)
  comments: Comment[];

  public static create(data: {
    hash: string;
    login: string;
    email: string;
  }): User {
    const user = new User();
    user.hash = data.hash;
    user.login = data.login;
    user.email = data.email;

    return user;
  }
}
