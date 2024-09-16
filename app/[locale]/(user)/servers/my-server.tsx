import InternalServerCard from '@/components/server/internal-server-card';
import getServerApi from '@/query/config/get-server-api';
import { getMeServers } from '@/query/user';

export async function MeServer() {
  const axios = await getServerApi();
  const servers = await getMeServers(axios);

  return servers.map((server) => (
    <InternalServerCard server={server} key={server.port} />
  ));
}
