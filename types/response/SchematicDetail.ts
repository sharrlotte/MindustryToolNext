import { Status } from '@/types/response/Status';
import { DetailTagDto } from '@/types/response/Tag';

import { ItemRequirement } from './ItemRequirement';

export type SchematicDetail = {
  id: string;
  name: string;
  userId: string;
  description: string;
  metadata: { requirements: ItemRequirement[] };
  tags: DetailTagDto[];
  likes: number;
  dislikes: number;
  height: number;
  width: number;
  status: Status;
  verifierId?: string;
  itemId: string;
  isVerified: boolean;
  downloadCount: number;
};
