import { Status } from '@/types/response/Status';

import { Like } from './Like';

export type Map = {
  id: string;
  name: string;
  like: number;
  userLike: Like;
  status: Status;
  itemId: string;
  isVerified: boolean;
};
