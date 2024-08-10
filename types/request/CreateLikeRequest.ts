import { LikeAction } from '@/constant/enum';

export interface CreateLikeRequest {
  itemId: string;
  action: LikeAction;
}
