import { DetailTagDto } from '@/types/response/Tag';

export type Plugin = {
	id: string;
	name: string;
	userId: string;
	description: string;
	tags: DetailTagDto[];
	url: string;
	isPrivate: boolean;
	lastReleaseAt: number;
	verifierId: string;
};
