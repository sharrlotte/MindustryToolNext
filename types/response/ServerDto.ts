import { ServerMode } from '@/types/request/UpdateServerRequest';

export type ServerStatus = 'DOWN' | 'UP' | 'HOST' | 'DELETED';

export type ServerDto = {
	id: string;
	name: string;
	userId: string;
	description: string;
	port: number;
	isOfficial: boolean;
	mode: ServerMode;
	status: ServerStatus;
	ramUsage: number;
	cpuUsage: number;
	totalRam: number;
	players: number;
	mapName: string;
	address: string;
	isAutoTurnOff: boolean;
	isHub: boolean;
	hostCommand?: string;
};
