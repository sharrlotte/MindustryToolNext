import { Like } from '@/types/response/Like';
import { Status } from '@/types/response/Status';

export interface PostDetail {
  id: string;
  userId: string;
  title: string;
  content: string;
  likes: number;
  tags: string[];
  lang: string;
  status: Status;
  translations: Record<
    string,
    {
      title: string;
      content: string;
    }
  >;
  userLike: Like;
  createdAt: number;
  itemId: string;
  isVerified: boolean;
}
