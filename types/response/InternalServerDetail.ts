import { InternalServerMode } from '@/types/request/UpdateInternalServerRequest';

export type InternalServerDetail = {
  id: string;
  name: string;
  userId: string;
  description: string;
  port: number;
  mode: InternalServerMode;
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
  mapImage?: string;
  startCommand?: string;
};
