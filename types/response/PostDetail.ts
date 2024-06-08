import { Like } from '@/types/response/Like';
import { Status } from '@/types/response/Status';

export interface PostDetail {
  id: string;
  authorId: string;
  header: string;
  content: string;
  like: number;
  tags: string[];
  lang: string;
  status: Status;
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
