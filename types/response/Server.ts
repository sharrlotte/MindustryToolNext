import { ServerStatus } from '@/constant/constant';
import { ServerMode } from '@/types/request/UpdateServerRequest';

export default interface Server {
	id: string;
	userId: string;
	managerId: string;
	port: number;
	name: string;
	description: string;
	mode: ServerMode;
	gamemode: string | undefined;
	isOfficial: boolean;
	hostCommand: string | null;
	address: string;
	image: string;
	avatar: string;
	webhook: string | null;
	isAutoTurnOff: boolean;
	isHub: boolean;
	status: ServerStatus;
	players: number;
}
