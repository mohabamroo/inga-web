import { User } from "./user.model";

export interface PostComment {
  id: number;
  content: string;
  createdAt: string;
  author: User;
}
