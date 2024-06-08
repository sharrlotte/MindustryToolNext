import { Status } from '@/types/response/Status';

import { ItemRequirement } from './ItemRequirement';
import { Like } from './Like';

export interface SchematicDetail {
  id: string;
  name: string;
  authorId: string;
  description: string;
  requirement: ItemRequirement[];
  tags: string[];
  like: number;
  height: number;
  width: number;
  status: Status;
  verifyAdmin: string;
  userLike: Like;
}
