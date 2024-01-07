import { Like } from '@/types/response/Like';

export interface Post {
  id: string;
  authorId: string;
  header: string;
  content: string;
  like: number;
  tags: string[];
  time: string;
  userLike: Like;
}
