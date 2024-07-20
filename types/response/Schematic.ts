import { Status } from '@/types/response/Status';

import { Like } from './Like';

export type Schematic = {
  id: string;
  name: string;
  like: number;
  userLike: Like;
  status: Status;
  itemId: string;
};
