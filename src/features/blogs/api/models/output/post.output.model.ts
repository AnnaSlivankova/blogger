import { Post } from '../../../domain/post.entity';

export class PostOutputModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: Array<{
      addedAt: string;
      userId: string;
      login: string;
    }>;
  };
}

//MAPPER
export const postOutputModelMapper = (
  post: Post,
  myStatus?: any,
  newestLikes?: any[],
): PostOutputModel => {
  const outputModel = new PostOutputModel();
  outputModel.id = post.id;
  outputModel.title = post.title;
  outputModel.shortDescription = post.shortDescription;
  outputModel.content = post.content;
  outputModel.blogId = post.blogId;
  outputModel.blogName = post.blog.name;
  outputModel.createdAt = post.createdAt.toISOString();
  outputModel.extendedLikesInfo = {
    dislikesCount: 0,
    likesCount: 0,
    myStatus: 'None',
    newestLikes: [],
  };

  return outputModel;
};
