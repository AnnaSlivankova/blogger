import { Controller } from '@nestjs/common';
import { PATH } from 'src/settings/app.settings';

@Controller(PATH.POSTS)
export class CommentsController {
  // constructor(private postsQueryRepository: PostsQueryRepository) {}
  // @Get()
  // async getAllPosts(
  //   @Query() query: QueryParams,
  // ): Promise<PaginationOutputModel<PostOutputModel>> {
  //   const posts = await this.postsQueryRepository.getAll(query);
  //   if (!posts) throw new BadRequestException();
  //   return posts;
  // }
  //
  // @Get(':id')
  // async getPost(@Param('id') id: string): Promise<PostOutputModel> {
  //   const post = await this.postsQueryRepository.getPostById(id);
  //   if (!post) throw new NotFoundException();
  //
  //   return post;
  // }
}
