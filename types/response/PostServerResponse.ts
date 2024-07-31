export default type PostServerResponse = {
  id: string;
  name: string;
  online: boolean;
  address: string;
  mapName: string;
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
  lastOnlineTime: number;
  createdAt: number;
}
