import { ServerStatus } from '@/constant/constant';
import { ServerMode } from '@/types/request/UpdateServerRequest';
import { ServerPlan } from '@/types/response/ServerPlan';


export type ServerSetting = {
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
	discordChannelId: string | null;
	avatar: string;
	webhook: string | null;
	isAutoTurnOff: boolean;
	isHub: boolean;
	isPaused: boolean;
	status: ServerStatus;
	players: number;
	planId: number;
	plan: ServerPlan;
}
