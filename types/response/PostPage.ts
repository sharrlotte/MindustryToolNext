import { Like } from '@/types/response/Like';

export type PostPage = Array<{
  id: string;
  authorId: string;
  header: string;
  like: number;
  userLike: Like;
}>;
