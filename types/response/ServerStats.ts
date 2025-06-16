import { ServerStatus } from '@/constant/constant';

export type ServerStats = {
	tps: number;
	ramUsage: number;
	jvmRamUsage: number;
	totalRam: number;
	cpuUsage: number;
	players: number;
	mapName: string;
	mods: string[];
	kicks: number;
	isPaused: boolean;
	isHosting: boolean;
	status: ServerStatus;
};
