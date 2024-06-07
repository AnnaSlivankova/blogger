import { Blog } from '../../../domain/blog.entity';

export class BlogOutputModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

//MAPPER
export const blogOutputModelMapper = (blog: Blog): BlogOutputModel => {
  const outputModel = new BlogOutputModel();
  outputModel.id = blog.id;
  outputModel.name = blog.name;
  outputModel.description = blog.description;
  outputModel.websiteUrl = blog.websiteUrl;
  outputModel.createdAt = blog.createdAt.toISOString();
  outputModel.isMembership = blog.isMembership;

  return outputModel;
};
