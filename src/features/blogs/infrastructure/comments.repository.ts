import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Comment } from '../domain/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async save(commentDto: Comment): Promise<string | null> {
    try {
      const res = await this.commentsRepository.save(commentDto);
      return res.id;
    } catch (e) {
      console.log('CommentsRepository/save', e);
      return null;
    }
  }

  async getById(id: string): Promise<Comment | null> {
    try {
      return await this.commentsRepository.findOne({
        where: { id },
        relations: ['user', 'post'],
      });
    } catch (e) {
      console.log('CommentsRepository/getById', e);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const res = await this.commentsRepository.delete({ id });
      return !!res.affected;
    } catch (e) {
      console.log('CommentsRepository/delete', e);
      return false;
    }
  }
}
