import { LikeStatuses } from '../like-statuses.enum';

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
  post: any,
  likesCount: number,
  dislikesCount: number,
): PostOutputModel => {
  const outputModel = new PostOutputModel();
  outputModel.id = post.id;
  outputModel.title = post.title;
  outputModel.shortDescription = post.shortDescription;
  outputModel.content = post.content;
  outputModel.blogId = post.blogId;
  outputModel.blogName = post.blogName;
  outputModel.createdAt = post.createdAt.toISOString();
  outputModel.extendedLikesInfo = {
    dislikesCount,
    likesCount,
    myStatus: post.myStatus || LikeStatuses.NONE,
    newestLikes: post.newestLikes || [],
  };

  return outputModel;
};
