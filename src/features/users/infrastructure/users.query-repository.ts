import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import {
  QueryParams,
  SortDirection,
} from '../../../infrastructure/models/query.params';
import { User } from '../domain/user.entity';
import { PaginationOutputModel } from '../../../infrastructure/models/pagination.output.model';
import {
  UserOutputModel,
  userOutputModelMapper,
} from '../api/models/output/user.output.model';

@Injectable()
export class UsersQueryRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getAll(
    query: QueryParams,
  ): Promise<PaginationOutputModel<UserOutputModel> | null> {
    try {
      const {
        searchLoginTerm,
        searchEmailTerm,
        pageSize,
        pageNumber,
        sortDirection,
        sortBy,
      } = query;
      const skip = query.getSkipItemsCount();
      const login = searchLoginTerm ? `%${searchLoginTerm}%` : `%%`;
      const email = searchEmailTerm ? `%${searchEmailTerm}%` : `%%`;
      const direction = sortDirection === SortDirection.ASC ? 'ASC' : 'DESC';

      const [items, totalCount] = await this.entityManager
        .createQueryBuilder()
        .select(['u.id', 'u.createdAt', 'u.login', 'u.email'])
        .from(User, 'u')
        .where('u.login ILIKE :login', { login: login })
        .orWhere('u.email ILIKE :email', { email: email })
        .orderBy(`u.${sortBy}`, direction)
        .skip(skip)
        .take(pageSize)
        .getManyAndCount();

      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        page: pageNumber,
        pageSize,
        pagesCount,
        totalCount,
        items: items.map((u) => userOutputModelMapper(u)),
      };
    } catch (e) {
      console.log('UsersQueryRepository/getAll', e);
      return null;
    }
  }

  async getById(id: string): Promise<UserOutputModel | null> {
    try {
      const res = await this.entityManager.findOne(User, {
        where: { id },
      });

      return userOutputModelMapper(res);
    } catch (e) {
      console.log('UsersQueryRepository/getById', e);
      return null;
    }
  }
}
