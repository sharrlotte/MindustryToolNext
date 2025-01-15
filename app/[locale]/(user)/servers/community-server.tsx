import ErrorScreen from '@/components/common/error-screen';
import ServerCard from '@/components/server/server-card';

import { serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getServers } from '@/query/server';

export async function CommunityServer() {
  const servers = await serverApi((axios) => getServers(axios, { official: false }));

  if (isError(servers)) {
    return <ErrorScreen error={servers} />;
  }

  return servers.map((server) => <ServerCard server={server} key={server.port} />);
}
