import InternalServerCard from '@/components/server/internal-server-card';
import getServerApi from '@/query/config/get-server-api';
import { getInternalServers } from '@/query/server';

export async function Servers() {
  const axios = await getServerApi();
  const servers = await getInternalServers(axios);

  return (
    <section className="grid gap-2 overflow-y-auto pr-1 md:grid-cols-2 lg:grid-cols-3">
      {servers.map((server) => (
        <InternalServerCard server={server} key={server.port} />
      ))}
    </section>
  );
}
