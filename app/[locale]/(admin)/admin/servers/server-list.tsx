import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import InternalServerCard from '@/components/server/internal-server-card';
import { getInternalServers } from '@/query/server';

export async function Servers() {
  const servers = await serverApi((axios) => getInternalServers(axios));

  if ('error' in servers) {
    return <ErrorScreen error={servers} />;
  }

  return (
    <section className="grid gap-2 overflow-y-auto pr-1 md:grid-cols-2 lg:grid-cols-3">
      {servers.map((server) => (
        <InternalServerCard server={server} key={server.port} />
      ))}
    </section>
  );
}
