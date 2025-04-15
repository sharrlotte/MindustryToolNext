export type ServerBuildLog = {
	id: string;
	message: string;
	serverId: string;
	player: {
		name: string;
		uuid: string;
		locale: string;
		team: { name: string; color: string };
	};
	building: {
		x: number;
		y: number;
		name: string;
		lastAccess: string;
	};
	createdAt: string;
};
