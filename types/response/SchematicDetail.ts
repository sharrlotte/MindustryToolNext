import { Status } from '@/types/response/Status';

import { ItemRequirement } from './ItemRequirement';
import { Like } from './Like';

export type SchematicDetail = {
  id: string;
  name: string;
  userId: string;
  description: string;
  requirements: ItemRequirement[];
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
