import { ServerMode } from '@/types/request/UpdateServerRequest';

export type ServerDetail = {
  id: string;
  name: string;
  userId: string;
  description: string;
  port: number;
  official: boolean;
  mode: ServerMode;
  started: boolean;
  alive: boolean;
  ramUsage: number;
  totalRam: number;
  players: number;
  playerList: {
    name: string;
    uuid: string;
  }[];
  mapName: string;
  hostCommand?: string;
};
