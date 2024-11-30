import { Like } from '@/types/response/Like';

export type LikeChange = {
  amountLike: number;
  amountDislike: number;
  like: Like;
};
