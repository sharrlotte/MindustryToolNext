import { Status } from '@/types/response/Status';

import { Like } from './Like';

export interface MapDetail {
  id: string;
  name: string;
  userId: string;
  description: string;
  tags: string[];
  like: number;
  height: number;
  width: number;
  status: Status;
  verfierId: string;
  userLike: Like;
  itemId: string;
  isVerified: boolean;
}
