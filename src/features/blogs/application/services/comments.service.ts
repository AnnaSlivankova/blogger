import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { Comment } from '../../domain/comment.entity';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository,
  ) {}

  async create(dto: {
    userId: string;
    postId: string;
    content: string;
  }): Promise<string | null> {
    const { userId, postId, content } = dto;
    const user = await this.usersRepository.getUserById(userId);
    if (!user) throw new BadRequestException();

    const post = await this.postsRepository.getById(postId);
    if (!post) throw new NotFoundException();

    const comment = Comment.create(user, post, { content });
    return await this.commentsRepository.save(comment);
  }

  //
  // async update(id: string, inputDto: UpdateBlogInputModel): Promise<boolean> {
  //   const blog = await this.blogsRepository.getById(id);
  //   if (!blog) throw new NotFoundException();
  //   blog.update(inputDto);
  //
  //   const blogId = await this.blogsRepository.save(blog);
  //   return !!blogId;
  // }
  //
  // async delete(id: string): Promise<boolean> {
  //   const blog = await this.blogsRepository.getById(id);
  //   if (!blog) throw new NotFoundException();
  //
  //   return await this.blogsRepository.delete(id);
  // }
  //
  // async createPostToBlog(
  //   blogId: string,
  //   inputDto: CreatePostInputModel,
  // ): Promise<string | null> {
  //   const blog = await this.blogsRepository.getById(blogId);
  //   if (!blog) throw new NotFoundException(`Blog with ID ${blogId} not found`);
  //
  //   const post = Post.create(blog, inputDto);
  //
  //   return await this.postsRepository.save(post);
  // }

  // async updatePost(
  //   blogId: string,
  //   postId: string,
  //   inputDto: UpdatePostInputModel,
  // ): Promise<boolean> {
  //   const { title, shortDescription, content } = inputDto;
  //
  //   const blog = await this.blogsRepository.getById(blogId);
  //   if (!blog) throw new NotFoundException(`Blog with ID ${blogId} not found`);
  //
  //   const post = await this.postsRepository.getById(postId);
  //   if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
  //   if (post.blogId !== blogId) throw new ForbiddenException();
  //   post.title = title;
  //   post.shortDescription = shortDescription;
  //   post.content = content;
  //
  //   const postIdUpd = await this.postsRepository.save(post);
  //
  //   return !!postIdUpd;
  // }

  // async deletePost(blogId: string, postId: string): Promise<boolean> {
  //   const blog = await this.blogsRepository.getById(blogId);
  //   if (!blog) throw new NotFoundException(`Blog with ID ${blogId} not found`);
  //
  //   const post = await this.postsRepository.getById(postId);
  //   if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
  //   if (post.blogId !== blogId) throw new ForbiddenException();
  //
  //   return await this.postsRepository.delete(postId);
  // }
}
