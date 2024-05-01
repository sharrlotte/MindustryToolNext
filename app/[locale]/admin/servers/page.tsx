import CreateServerDialog from '@/app/[locale]/admin/servers/create-server-dialog';
import ReloadServerDialog from '@/app/[locale]/admin/servers/reload-server-dialog';
import InternalServerCard from '@/components/server/internal-server-card';
import getServerAPI from '@/query/config/get-server-api';
import getInternalServers from '@/query/server/get-internal-servers';
import React from 'react';

export default async function Page() {
  const { axios } = await getServerAPI();
  const servers = await getInternalServers(axios);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end gap-2 rounded-md bg-card p-2">
        <ReloadServerDialog />
        <CreateServerDialog />
      </div>
      <section className="grid gap-2">
        {servers.map((server) => (
          <InternalServerCard server={server} key={server.port} />
        ))}
      </section>
    </div>
  );
}
