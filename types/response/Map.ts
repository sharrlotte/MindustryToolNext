import { Status } from '@/types/response/Status';


export type Map = {
	id: string;
	name: string;
	likes: number;
	dislikes: number;
	status: Status;
	itemId: string;
	isVerified: boolean;
	downloadCount: number;
	createdAt: string;
};
