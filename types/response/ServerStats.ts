export type ServerStats = {
	ramUsage: number;
	cpuUsage: number;
	totalRam: number;
	mapName?: string;
	status: ServerStats;
    mods: string[];
};
