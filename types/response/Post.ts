import { Like } from '@/types/response/Like';
import { Status } from '@/types/response/Status';

export type Post = {
  id: string;
  authorId: string;
  header: string;
  like: number;
  userLike: Like;
  tags: string[];
  createdAt: number;
  status: Status;
};
