export type InternalServerDetail = {
  id: string;
  name: string;
  description: string;
  port: number;
  mode: 'SURVIVAL' | 'ATTACK' | 'PVP';
  started: boolean;
  alive: boolean;
  ramUsage: number;
  totalRam: number;
  players: number;
  mapName: string;
};
