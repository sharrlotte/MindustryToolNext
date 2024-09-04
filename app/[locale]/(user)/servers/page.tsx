import React, { Suspense } from 'react';

import CreateServerDialog from '@/app/[locale]/(user)/servers/create-server-dialog';
import InternalServerCard from '@/components/server/internal-server-card';
import getServerApi from '@/query/config/get-server-api';
import { getInternalServers } from '@/query/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Tran from '@/components/common/tran';
import { getMeServers } from '@/query/user';
import InternalServerCardSkeleton from '@/components/server/internal-server-card-skeleton';
import { getSession } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import LoginButton from '@/components/button/login-button';

export const experimental_ppr = true;

const skeleton = Array(8)
  .fill(1)
  .map((_, index) => <InternalServerCardSkeleton key={index} />);

export default async function Page() {
  const session = await getSession();

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
          className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2 overflow-y-auto pr-1"
          value="community-server"
        >
          <Suspense fallback={skeleton}>
            <CommunityServer />
          </Suspense>
        </TabsContent>
        <TabsContent
          className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2 overflow-y-auto pr-1"
          value="my-server"
        >
          <ProtectedElement session={session} alt={<RequireLogin />}>
            <Suspense fallback={skeleton}>
              <MeServer />
            </Suspense>
          </ProtectedElement>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RequireLogin() {
  return (
    <div>
      <p>Please login to access your server list.</p>
      <LoginButton />
    </div>
  );
}

async function CommunityServer() {
  const axios = await getServerApi();
  const servers = await getInternalServers(axios);

  return servers.map((server) => (
    <InternalServerCard server={server} key={server.port} />
  ));
}
async function MeServer() {
  const axios = await getServerApi();
  const servers = await getMeServers(axios);

  return servers.map((server) => (
    <InternalServerCard server={server} key={server.port} />
  ));
}
