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
  comment: any,
  likesCount?: number,
  dislikesCount?: number,
  myStatus?: LikeStatuses,
): CommentOutputModel => {
  // console.log(comment.likes, 'commentOutputModelMapper');
  const outputModel = new CommentOutputModel();
  outputModel.id = comment.comment_id ?? comment.id;
  outputModel.content = comment.comment_content ?? comment.content;
  outputModel.commentatorInfo = {
    userId: comment.comment_userId ?? comment.userId,
    userLogin: comment.user_login ?? comment.user.login,
  };
  outputModel.createdAt = comment.comment_createdAt
    ? comment.comment_createdAt.toISOString()
    : comment.createdAt.toISOString();
  outputModel.likesInfo = {
    likesCount,
    dislikesCount,
    myStatus: myStatus
      ? myStatus
      : !!comment.likes[0]
      ? (comment.likes[0].likeStatus as LikeStatuses)
      : LikeStatuses.NONE,
    // myStatus: !!comment.likes[0]
    //   ? (comment.likes[0].likeStatus as LikeStatuses)
    //   : LikeStatuses.NONE,
  };

  return outputModel;
};

// comment_id: 'ba3b128a-8e5d-4510-be02-02e64fc8b37e',
//   comment_createdAt: 2024-06-19T06:14:57.043Z,
//   comment_updatedAt: 2024-06-19T06:14:57.043Z,
//   comment_content: 'some new comment too long for validation1',
//   comment_userId: '8bd3a2d4-bb1c-4d94-9a6a-1c9e16211d50',
//   comment_postId: 'fffa0b6b-a96b-479a-ac18-0757b480023b',
//   user_id: '8bd3a2d4-bb1c-4d94-9a6a-1c9e16211d50',
//   user_createdAt: 2024-06-19T05:54:10.729Z,
//   user_updatedAt: 2024-06-19T05:54:10.729Z,
//   user_login: 'hanna',
//   user_email: 'email@gg.com',
//   user_hash: '$2b$10$zBSxSbCIYamX5D4vjKOXKegG19vUnQohM3ylmxVfvn0YDFAxwU5Ie',
//   post_id: 'fffa0b6b-a96b-479a-ac18-0757b480023b',
//   post_createdAt: 2024-06-19T05:54:55.943Z,
//   post_updatedAt: 2024-06-19T05:54:55.943Z,
//   post_title: 'length',
//   post_shortDescription: 'some description from postman',
//   post_content: 'valid',
//   post_blogId: 'b43312b2-f678-403d-a81e-c783f9ca1a2b',
//   likeStatus: 'Like'
