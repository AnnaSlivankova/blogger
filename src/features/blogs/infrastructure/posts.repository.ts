import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Post } from '../domain/post.entity';
import {
  PostOutputModel,
  postOutputModelMapper,
} from '../api/models/output/post.output.model';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async save(postDto: Post): Promise<string | null> {
    try {
      const res = await this.postRepository.save(postDto);
      return res.id;
    } catch (e) {
      console.log('PostsRepository/save', e);
      return null;
    }
  }

  async getById(id: string): Promise<Post | null> {
    try {
      return await this.postRepository.findOne({ where: { id } });
    } catch (e) {
      console.log('PostsRepository/getById', e);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const res = await this.postRepository.delete({ id });
      return !!res.affected;
    } catch (e) {
      console.log('PostsRepository/delete', e);
      return false;
    }
  }
}
