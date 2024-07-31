import { Status } from '@/types/response/Status';

import { Like } from './Like';

export type Map = {
  id: string;
  name: string;
  likes: number;
  userLike: Like;
  status: Status;
  itemId: string;
  isVerified: boolean;
};
