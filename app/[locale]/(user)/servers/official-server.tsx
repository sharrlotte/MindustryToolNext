import ErrorScreen from '@/components/common/error-screen';
import InternalServerCard from '@/components/server/internal-server-card';

import { serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getInternalServers } from '@/query/server';

export async function OfficialServer() {
  const servers = await serverApi((axios) => getInternalServers(axios, { official: true }));

  if (isError(servers)) {
    return <ErrorScreen error={servers} />;
  }

  return servers.map((server) => <InternalServerCard server={server} key={server.port} />);
}
