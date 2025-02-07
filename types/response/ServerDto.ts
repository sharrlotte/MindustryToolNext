import { ServerMode } from '@/types/request/UpdateServerRequest';

export type ServerStatus = 'DOWN' | 'UP' | 'HOST';

export type ServerDto = {
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
  mapName: string;
  autoTurnOff: boolean;
  hub: boolean;
  hostCommand?: string;
};
