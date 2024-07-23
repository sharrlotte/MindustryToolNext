import { LikeAction } from '@/constant/enum';

export interface LikePostRequest {
  itemId: string;
  action: LikeAction;
}
