import { InternalServerMode } from '@/types/request/UpdateInternalServerRequest';

export type InternalServerDetail = {
  id: string;
  name: string;
  userId: string;
  description: string;
  port: number;
  official: boolean;
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
  hostCommand?: string;
};
