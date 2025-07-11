import { Status } from '@/types/response/Status';

export type Schematic = {
	id: string;
	name: string;
	likes: number;
	dislikes: number;
	status: Status;
	itemId: string;
	isVerified: boolean;
        downloadCount: number;
        viewCount: number;
        createdAt: string;
};
