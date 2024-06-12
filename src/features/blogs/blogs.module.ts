import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { BlogsService } from './application/services/blogs.service';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { BlogsQueryRepository } from './infrastructure/blogs-query-repository';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/posts-query.repository';
import { Post } from './domain/post.entity';
import { BlogsAdminController } from './api/blogs-admin.controller';
import { BlogsController } from './api/blogs.controller';
import { PostsController } from './api/posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Post])],
  controllers: [BlogsAdminController, BlogsController, PostsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
  ],
  exports: [BlogsService],
})
export class BlogsModule {}
