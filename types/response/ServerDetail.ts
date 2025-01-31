import { ServerMode } from '@/types/request/UpdateServerRequest';

export type ServerStatus = 'DOWN' | 'UP' | 'HOST';

export type ServerDetail = {
  id: string;
  name: string;
  userId: string;
  description: string;
  port: number;
  official: boolean;
  mode: ServerMode;
  status: ServerStatus;
  ramUsage: number;
  totalRam: number;
  players: number;
  playerList: {
    name: string;
    uuid: string;
  }[];
  mapName: string;
  autoTurnOff: boolean;
  hub: boolean;
  hostCommand?: string;
};
