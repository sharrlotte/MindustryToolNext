import { isError } from '@/lib/utils';
import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import InternalServerCard from '@/components/server/internal-server-card';
import { getMeServers } from '@/query/user';

export async function MeServer() {
  const servers = await serverApi((axios) => getMeServers(axios));

  if (isError(servers)) {
    return <ErrorScreen error={servers} />;
  }

  return servers.map((server) => <InternalServerCard server={server} key={server.port} />);
}
