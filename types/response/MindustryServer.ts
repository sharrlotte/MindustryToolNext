import { Like } from '@/types/response/Like';

export default interface MindustryServer {
  id: string;
  name: string;
  online: boolean;
  address: string;
  mapname: string;
  description: string;
  wave: number;
  players: number;
  playerLimit: number;
  version: number;
  versionType: string;
  mode: string;
  modeName: string;
  ping: number;
  port: number;
  like: number;
  userLike: Like;
  lastOnlineTime: number;
  createdAt: number;
}
