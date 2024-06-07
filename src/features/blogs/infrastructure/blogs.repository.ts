import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blog.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async save(blogDto: Blog): Promise<string | null> {
    try {
      const res = await this.blogRepository.save(blogDto);
      return res.id;
    } catch (e) {
      console.log('BlogsRepository/save', e);
      return null;
    }
  }

  async getById(id: string): Promise<Blog | null> {
    try {
      return await this.blogRepository.findOne({ where: { id } });
    } catch (e) {
      console.log('BlogsRepository/getById', e);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const res = await this.blogRepository.delete({ id });
      return !!res.affected;
    } catch (e) {
      console.log('BlogsRepository/delete', e);
      return false;
    }
  }
}
