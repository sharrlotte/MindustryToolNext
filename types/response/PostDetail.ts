import { Like } from '@/types/response/Like';
import { Status } from '@/types/response/Status';

export type PostDetail = {
  id: string;
  userId: string;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  tags: string[];
  lang: string;
  imageUrls: string[];
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
  updateForId: string;
};
