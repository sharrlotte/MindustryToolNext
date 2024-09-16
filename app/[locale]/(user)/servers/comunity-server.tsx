import InternalServerCard from '@/components/server/internal-server-card';
import getServerApi from '@/query/config/get-server-api';
import { getInternalServers } from '@/query/server';

export async function CommunityServer() {
  const axios = await getServerApi();
  const servers = await getInternalServers(axios);

  return servers.map((server) => (
    <InternalServerCard server={server} key={server.port} />
  ));
}
