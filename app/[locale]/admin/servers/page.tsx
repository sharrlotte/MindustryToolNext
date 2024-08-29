import React from 'react';

import InternalServerCard from '@/components/server/internal-server-card';
import getServerAPI from '@/query/config/get-server-api';
import CreateServerDialog from '@/app/[locale]/(user)/servers/create-server-dialog';
import ReloadServerDialog from '@/app/[locale]/(user)/servers/reload-server-dialog';
import { getInternalServers } from '@/query/server';

export default async function Page() {
  const axios = await getServerAPI();
  const servers = await getInternalServers(axios);

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-4">
      <div className="flex justify-end gap-2 rounded-md bg-card p-2">
        <ReloadServerDialog />
        <CreateServerDialog />
      </div>
      <section className="grid gap-2 overflow-y-auto pr-1 md:grid-cols-2 lg:grid-cols-3">
        {servers.map((server) => (
          <InternalServerCard server={server} key={server.port} />
        ))}
      </section>
    </div>
  );
}
