import { ErrorStatus } from '@/constant/constant';

export type ErrorReport = {
	id: string;
	content: any;
	ip: string;
	status: ErrorStatus;
	createdAt: number;
};
