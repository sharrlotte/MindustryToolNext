import { Status } from '@/types/response/Status';

import { ItemRequirement } from './ItemRequirement';
import { Like } from './Like';

export interface SchematicDetail {
  id: string;
  name: string;
  userId: string;
  description: string;
  requirements: ItemRequirement[];
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
