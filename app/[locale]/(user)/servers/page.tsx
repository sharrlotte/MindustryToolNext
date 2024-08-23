import React from 'react';

import CreateServerDialog from '@/app/[locale]/(user)/servers/create-server-dialog';
import InternalServerCard from '@/components/server/internal-server-card';
import getServerAPI from '@/query/config/get-server-api';
import { getInternalServers } from '@/query/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Tran from '@/components/common/tran';
import { getMeServers } from '@/query/user';

export default async function Page() {
  const axios = await getServerAPI();
  const [servers, myServers] = await Promise.all([
    getInternalServers(axios),
    getMeServers(axios),
  ]);

  return (
    <div className="flex flex-col gap-2 p-4">
      <Tabs defaultValue="my-server">
        <div className="flex justify-between gap-2 rounded-md bg-card p-2">
          <div>
            <TabsList>
              <TabsTrigger value="my-server">
                <Tran text="server.my-server" />
              </TabsTrigger>
              <TabsTrigger value="server-list">
                <Tran text="server.server-list" />
              </TabsTrigger>
            </TabsList>
          </div>
          <CreateServerDialog />
        </div>
        <section className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          <TabsContent value="server-list">
            {servers.map((server) => (
              <InternalServerCard server={server} key={server.port} />
            ))}
          </TabsContent>
          <TabsContent value="my-server">
            {myServers.map((server) => (
              <InternalServerCard server={server} key={server.port} />
            ))}
          </TabsContent>
        </section>
      </Tabs>
    </div>
  );
}
