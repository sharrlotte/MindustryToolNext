import { LikeAction } from '@/constant/constant';

export interface CreateLikeRequest {
	itemId: string;
	action: LikeAction;
}
