import ErrorScreen from '@/components/common/error-screen';
import ServerCard from '@/components/server/server-card';

import { serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getServersByAdmin } from '@/query/server';

export async function CommunityAdminServer() {
  const servers = await serverApi((axios) => getServersByAdmin(axios, { official: false, page: 0, size: 50 }));

  if (isError(servers)) {
    return <ErrorScreen error={servers} />;
  }

  return servers.map((server) => <ServerCard server={server} key={server.port} />);
}
