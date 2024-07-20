import { Like } from '@/types/response/Like';
import { Status } from '@/types/response/Status';

export type Post = {
  id: string;
  authorId: string;
  title: string;
  likes: number;
  userLike: Like;
  tags: string[];
  createdAt: number;
  status: Status;
  itemId: string;
};
