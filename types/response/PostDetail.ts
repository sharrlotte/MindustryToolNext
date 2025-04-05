import { Status } from '@/types/response/Status';
import { DetailTagDto } from '@/types/response/Tag';

export type PostDetail = {
  id: string;
  userId: string;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  tags: DetailTagDto[];
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
  createdAt: number;
  itemId: string;
  isVerified: boolean;
  updateForId: string;
};
