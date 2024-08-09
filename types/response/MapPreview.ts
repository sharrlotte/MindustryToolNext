import { Status } from '@/types/response/Status';

import { Like } from './Like';

export type MapPreview = {
  id: string;
  name: string;
  likes: number;
  userLike: Like;
  status: Status;
  itemId: string;
  isVerified: boolean;
};
