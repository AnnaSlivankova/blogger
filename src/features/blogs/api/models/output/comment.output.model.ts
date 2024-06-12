import { LikeStatuses } from '../like-statuses.enum';
import { Comment } from '../../../domain/comment.entity';

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
  comment: Comment,
): CommentOutputModel => {
  const outputModel = new CommentOutputModel();
  outputModel.id = comment.id;
  outputModel.content = comment.content;
  outputModel.commentatorInfo = {
    userId: comment.userId,
    userLogin: comment.user.login,
  };
  outputModel.createdAt = comment.createdAt.toISOString();
  outputModel.likesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: LikeStatuses.NONE,
  };

  return outputModel;
};
