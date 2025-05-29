import { ServerStatus } from '@/constant/constant';
import { ServerMode } from '@/types/request/UpdateServerRequest';

export type ServerDto = {
	id: string;
	name: string;
	userId: string;
	description: string;
	port: number;
	isOfficial: boolean;
	mode: ServerMode;
	gamemode?: string;
	status: ServerStatus;
	ramUsage: number;
	cpuUsage: number;
	totalRam: number;
	players: number;
	mapName: string;
	address: string;
	avatar: string;
	isAutoTurnOff: boolean;
	isHub: boolean;
	isPaused: boolean;
	hostCommand?: string;
	kicks: number;
};
