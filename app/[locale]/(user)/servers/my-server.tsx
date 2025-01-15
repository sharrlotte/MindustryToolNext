import ErrorScreen from '@/components/common/error-screen';
import ServerCard from '@/components/server/server-card';

import { serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getMeServers } from '@/query/user';

export async function MeServer() {
  const servers = await serverApi((axios) => getMeServers(axios));

  if (isError(servers)) {
    return <ErrorScreen error={servers} />;
  }

  return servers.map((server) => <ServerCard server={server} key={server.port} />);
}
