import { Like } from '@/types/response/Like';

export type Post = {
  id: string;
  authorId: string;
  header: string;
  like: number;
  userLike: Like;
  tags: string[];
  time: number;
};
