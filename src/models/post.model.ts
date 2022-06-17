import { User } from "./user.model";

export interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  author?: User;
  authorId?: number;
  createdAt: string;
  updatedAt: Date;
}
