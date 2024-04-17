import ServerInstancesCard from '@/components/server/server-instances-card';
import { Button } from '@/components/ui/button';
import getServerAPI from '@/query/config/get-server-api';
import getServerInstances from '@/query/server/get-servers-instances';
import React from 'react';

export default async function Page() {
  const { axios } = await getServerAPI();
  const servers = await getServerInstances(axios);

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-md bg-card p-2">
        <Button
          className="ml-auto flex"
          title="Create new server"
          variant="primary"
        >
          Create new server
        </Button>
      </div>
      <section>
        {servers.map((server) => (
          <ServerInstancesCard server={server} key={server.port} />
        ))}
      </section>
    </div>
  );
}
