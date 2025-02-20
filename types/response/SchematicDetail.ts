import { Status } from '@/types/response/Status';



import { ItemRequirement } from './ItemRequirement';
import { Like } from './Like';
import { DetailTagDto } from '@/types/response/Tag';


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
  userLike?: Like;
  itemId: string;
  isVerified: boolean;
  downloadCount: number;
};
