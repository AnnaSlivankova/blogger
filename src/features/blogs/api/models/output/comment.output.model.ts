import { LikeStatuses } from '../like-statuses.enum';

export class CommentOutputModel {
  id: string;
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatuses;
  };
}

//MAPPER
export const commentOutputModelMapper = (
  comment: any,
  likesCount: number,
  dislikesCount: number,
): CommentOutputModel => {
  const outputModel = new CommentOutputModel();
  outputModel.id = comment.id;
  outputModel.content = comment.content;
  outputModel.commentatorInfo = {
    userId: comment.userId,
    userLogin: comment.userLogin,
  };
  outputModel.createdAt = comment.createdAt.toISOString();
  outputModel.likesInfo = {
    likesCount,
    dislikesCount,
    myStatus: comment.myStatus || LikeStatuses.NONE,
  };

  return outputModel;
};
