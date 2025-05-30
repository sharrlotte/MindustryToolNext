import { ErrorStatus } from '@/constant/constant';

export type ErrorReport = {
	id: string;
	content: string;
	ip: string;
	status: ErrorStatus;
	createdAt: number;
};
