import { Like } from '@/types/response/Like';

export interface PostDetail {
  id: string;
  authorId: string;
  header: string;
  content: string;
  like: number;
  tags: string[];
  time: number;
  userLike: Like;
}
