export type Player = {
	name: string;
	uuid: string;
	userId?: string;
	locale?: string;
	ip: string;
	isAdmin: boolean;
	joinedAt: number;
	team: {
		name: string;
		color: string;
	};
};
