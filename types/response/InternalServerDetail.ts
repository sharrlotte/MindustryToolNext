import { InternalServerMode } from '@/types/request/PutInternalServerRequest';

export type InternalServerDetail = {
  id: string;
  name: string;
  description: string;
  port: number;
  mode: InternalServerMode;
  discordChannelId: string;
  started: boolean;
  alive: boolean;
  ramUsage: number;
  totalRam: number;
  players: number;
  mapName: string;
};
