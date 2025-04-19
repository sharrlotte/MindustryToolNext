import { ServerMode } from '@/types/request/UpdateServerRequest';

export default interface Server {
	id: string;
	userId: string;
	managerId: string;
	port: number;
	name: string;
	description: string;
	mode: ServerMode;
	gamemode: string | null;
	isOfficial: boolean;
	hostCommand: string | null;
	address: string;
	image: string;
	webhook: string | null;
	isAutoTurnOff: boolean;
	isHub: boolean;
}
