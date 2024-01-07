import { LikeAction, LikeTarget } from '@/constant/enum';

export interface LikePostRequest {
  targetId: string;
  targetType: LikeTarget;
  action: LikeAction;
}
