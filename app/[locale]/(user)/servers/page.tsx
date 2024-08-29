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

const skeleton = Array(8)
  .fill(1)
  .map((_, index) => <InternalServerCardSkeleton key={index} />);

export default function Page() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <Tabs
        className="flex flex-col overflow-hidden"
        defaultValue="community-server"
      >
        <div className="flex flex-wrap justify-between gap-2">
          <div>
            <TabsList>
              <TabsTrigger value="community-server">
                <Tran text="server.community-server" />
              </TabsTrigger>
              <TabsTrigger value="my-server">
                <Tran text="server.my-server" />
              </TabsTrigger>
            </TabsList>
          </div>
          <CreateServerDialog />
        </div>
        <TabsContent
          className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-2 overflow-y-auto pr-1"
          value="community-server"
        >
          <Suspense fallback={skeleton}>
            <CommunityServer />
          </Suspense>
        </TabsContent>
        <TabsContent
          className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-2 overflow-y-auto pr-1"
          value="my-server"
        >
          <Suspense fallback={skeleton}>
            <MeServer />
          </Suspense>
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
    <Skeleton className="flex h-28 w-full max-w-[799px] rounded-md bg-card" />
  );
}
