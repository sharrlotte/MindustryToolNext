import ErrorScreen from '@/components/common/error-screen';
import ServerCard from '@/components/server/server-card';

import { serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getServers } from '@/query/server';

export default async function OfficialServer({ valid }: { valid: boolean }) {
  const servers = await serverApi((axios) => getServers(axios, { valid, official: true, page: 0, size: 50 }));

  if (isError(servers)) {
    return <ErrorScreen error={servers} />;
  }

  return servers.map((server) => <ServerCard server={server} key={server.port} />);
}
