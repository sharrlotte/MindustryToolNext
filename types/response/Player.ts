export type Player = {
	name: string;
	uuid: string;
	userId?: string;
	locale?: string;
	ip: string;
	team: {
		name: string;
		color: string;
	};
};
