import { ServerStats } from '@/types/response/ServerStats';

export type ServerLiveStats = {
	index: number;
	createdAt: Date;
	value: ServerStats;
};
