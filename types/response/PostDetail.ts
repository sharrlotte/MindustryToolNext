import { Like } from '@/types/response/Like';

export interface PostDetail {
  id: string;
  authorId: string;
  header: string;
  content: string;
  like: number;
  tags: string[];
  lang: string
  translations: Record<
    string,
    {
      header: string;
      content: string;
    }
  >;
  userLike: Like;
  createdAt: number;
}
