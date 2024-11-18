import { Status } from '@/types/response/Status';

export type Post = {
  id: string;
  userId: string;
  title: string;
  likes: number;
  tags: string[];
  imageUrls: string[];
  createdAt: number;
  status: Status;
  itemId: string;
  isVerified: boolean;
};
