import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PATH } from '../../../settings/app.settings';
import { UsersService } from '../application/services/users.service';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { QueryParams } from '../../../infrastructure/models/query.params';
import { UserCreateModel } from './models/input/user-create.model';
import { UserOutputModel } from './models/output/user.output.model';
import { AuthBasicGuard } from 'src/infrastructure/guards/auth.basic.guard';
import { UsersRepository } from '../infrastructure/users.repository';

@UseGuards(AuthBasicGuard)
@Controller(PATH.USERS_SA)
export class UsersController {
  constructor(
    private userService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
    private usersRepository: UsersRepository,
  ) {}

  @Get()
  async getAllUsers(@Query() query: QueryParams) {
    const users = await this.usersQueryRepository.getAll(query);
    if (!users) throw new NotFoundException();
    return users;
  }

  @Post()
  async createUser(
    @Body() createUserModel: UserCreateModel,
  ): Promise<UserOutputModel> {
    const userId = await this.userService.create(createUserModel);
    if (!userId) throw new NotFoundException();

    const user = await this.usersQueryRepository.getById(userId);
    if (!user) throw new NotFoundException();

    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const isDeleted = await this.userService.deleteById(id);
    if (!isDeleted) throw new NotFoundException();
    return;
  }

  // @Get(':id')
  // async _getUserById(@Param('id') id: string) {
  //   const user = await this.usersRepository.getUserById(id);
  //   if (!user) throw new NotFoundException();
  //   return user;
  // }
}
