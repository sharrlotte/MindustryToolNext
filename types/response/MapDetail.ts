import { Status } from '@/types/response/Status';

import { Like } from './Like';

export type MapDetail = {
  id: string;
  name: string;
  userId: string;
  description: string;
  tags: string[];
  likes: number;
  height: number;
  width: number;
  status: Status;
  verifierId: string;
  userLike: Like;
  itemId: string;
  isVerified: boolean;
};
