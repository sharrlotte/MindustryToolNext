import { Status } from '@/types/response/Status';
import { DetailTagDto } from '@/types/response/Tag';

export type Post = {
  id: string;
  userId: string;
  title: string;
  likes: number;
  dislikes: number;
  tags: DetailTagDto[];
  imageUrls: string[];
  createdAt: number;
  status: Status;
  itemId: string;
  isVerified: boolean;
};
