import { User } from '../../../domain/user.entity';

export class UserOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

//MAPPER
export const userOutputModelMapper = (user: User): UserOutputModel => {
  const outputModel = new UserOutputModel();
  outputModel.id = user.id;
  outputModel.login = user.login;
  outputModel.email = user.email;
  outputModel.createdAt = user.createdAt.toISOString();

  return outputModel;
};
