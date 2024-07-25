import { Like } from '@/types/response/Like';
import { Status } from '@/types/response/Status';

export type Post = {
  id: string;
  userId: string;
  title: string;
  likes: number;
  userLike: Like;
  tags: string[];
  imageUrls: string[];
  createdAt: number;
  status: Status;
  itemId: string;
  isVerified: boolean;
};
