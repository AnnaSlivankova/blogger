import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CreateBlogInputModel } from '../../api/models/input/create-blog.input.model';
import { Blog } from '../../domain/blog.entity';
import { UpdateBlogInputModel } from '../../api/models/input/update-blog.input.model';
import { CreatePostInputModel } from '../../api/models/input/create-post.input.model';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { Post } from '../../domain/post.entity';
import { UpdatePostInputModel } from '../../api/models/input/update-post.input.model';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async create(inputDto: CreateBlogInputModel): Promise<string | null> {
    const blog = Blog.create(inputDto);
    return await this.blogsRepository.save(blog);
  }

  async update(id: string, inputDto: UpdateBlogInputModel): Promise<boolean> {
    const blog = await this.blogsRepository.getById(id);
    if (!blog) throw new NotFoundException();
    blog.update(inputDto);

    const blogId = await this.blogsRepository.save(blog);
    return !!blogId;
  }

  async delete(id: string): Promise<boolean> {
    const blog = await this.blogsRepository.getById(id);
    if (!blog) throw new NotFoundException();

    return await this.blogsRepository.delete(id);
  }

  async createPostToBlog(
    blogId: string,
    inputDto: CreatePostInputModel,
  ): Promise<string | null> {
    const blog = await this.blogsRepository.getById(blogId);
    if (!blog) throw new NotFoundException(`Blog with ID ${blogId} not found`);

    const post = Post.create(blog, inputDto, blog.name);

    return await this.postsRepository.save(post);
  }

  async updatePost(
    blogId: string,
    postId: string,
    inputDto: UpdatePostInputModel,
  ): Promise<boolean> {
    const { title, shortDescription, content } = inputDto;

    const blog = await this.blogsRepository.getById(blogId);
    if (!blog) throw new NotFoundException(`Blog with ID ${blogId} not found`);

    const post = await this.postsRepository.getById(postId);
    if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
    if (post.blogId !== blogId) throw new ForbiddenException();
    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;

    const postIdUpd = await this.postsRepository.save(post);

    return !!postIdUpd;
  }

  async deletePost(blogId: string, postId: string): Promise<boolean> {
    const blog = await this.blogsRepository.getById(blogId);
    if (!blog) throw new NotFoundException(`Blog with ID ${blogId} not found`);

    const post = await this.postsRepository.getById(postId);
    if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
    if (post.blogId !== blogId) throw new ForbiddenException();

    return await this.postsRepository.delete(postId);
  }
}
