export interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;

  authorId?: number;
  createdAt: string;
  updatedAt: Date;
}
