export type UserLoginHistory = {
	id: string;
	ip: string;
	userId: string;
	counts: number;
	client: number;
	browser?: string;
	os?: string;
	createdAt: number;
};
