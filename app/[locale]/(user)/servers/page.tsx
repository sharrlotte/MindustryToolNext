import React, { Suspense } from 'react';

import CreateServerDialog from '@/app/[locale]/(user)/servers/create-server-dialog';
import InternalServerCard from '@/components/server/internal-server-card';
import getServerAPI from '@/query/config/get-server-api';
import { getInternalServers } from '@/query/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Tran from '@/components/common/tran';
import { getMeServers } from '@/query/user';
import { Skeleton } from '@/components/ui/skeleton';

export const experimental_ppr = true;

const skeleton = Array(3)
  .fill(1)
  .map((_, index) => <InternalServerCardSkeleton key={index} />);

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Tabs defaultValue="my-server">
        <div className="flex justify-between gap-2">
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
        <TabsContent value="server-list">
          <section className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] justify-center gap-2">
            <Suspense fallback={skeleton}>
              <CommunityServer />
            </Suspense>
          </section>
        </TabsContent>
        <TabsContent value="my-server">
          <section className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] justify-center gap-2">
            <Suspense fallback={skeleton}>
              <MeServer />
            </Suspense>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function CommunityServer() {
  const axios = await getServerAPI();
  const servers = await getInternalServers(axios);

  return servers.map((server) => (
    <InternalServerCard server={server} key={server.port} />
  ));
}
async function MeServer() {
  const axios = await getServerAPI();
  const servers = await getMeServers(axios);

  return servers.map((server) => (
    <InternalServerCard server={server} key={server.port} />
  ));
}

function InternalServerCardSkeleton() {
  return (
    <Skeleton className="flex h-28 w-full max-w-[559px] rounded-md bg-card" />
  );
}
