import { Status } from '@/types/response/Status';
import { DetailTagDto } from '@/types/response/Tag';

import { Like } from './Like';

export type MapDetail = {
  id: string;
  name: string;
  userId: string;
  description: string;
  tags: DetailTagDto[];
  likes: number;
  dislikes: number;
  height: number;
  width: number;
  status: Status;
  verifierId: string;
  userLike: Like;
  itemId: string;
  isVerified: boolean;
  downloadCount: number;
};
