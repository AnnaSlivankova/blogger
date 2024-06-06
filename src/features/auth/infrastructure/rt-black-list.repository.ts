import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RtBlackList } from '../domain/rt-black-list.entity';

@Injectable()
export class RtBlackListRepository {
  constructor(
    @InjectRepository(RtBlackList)
    private readonly repo: Repository<RtBlackList>,
  ) {}

  async getByToken(token: string): Promise<RtBlackList | null> {
    try {
      return await this.repo.findOne({ where: { refreshToken: token } });
    } catch (e) {
      console.log('RtBlackListRepository/getByToken', e);
      return null;
    }
  }

  async putInBlackList(tokens: RtBlackList[]): Promise<boolean> {
    try {
      const res = await this.repo.save(tokens);
      return !!res;
    } catch (e) {
      console.log('RtBlackListRepository/putInBlackList', e);
      return false;
    }
  }
}
