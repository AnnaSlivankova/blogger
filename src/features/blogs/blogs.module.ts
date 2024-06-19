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
import { Comment } from './domain/comment.entity';
import { CommentsController } from './api/comments.controller';
import { CommentsRepository } from './infrastructure/comments.repository';
import { CommentsService } from './application/services/comments.service';
import { CommentsQueryRepository } from './infrastructure/comments-query.repository';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { CommentLikeStatus } from './domain/comment-like-status.entity';
import { LikesCommentService } from './application/services/likes-comment.service';
import { LikesCommentRepository } from './infrastructure/likes-comment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, Post, Comment, CommentLikeStatus]),
    UsersModule,
    AuthModule,
  ],
  controllers: [
    BlogsAdminController,
    BlogsController,
    PostsController,
    CommentsController,
  ],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    LikesCommentService,
    LikesCommentRepository,
  ],
  exports: [BlogsService],
})
export class BlogsModule {}
