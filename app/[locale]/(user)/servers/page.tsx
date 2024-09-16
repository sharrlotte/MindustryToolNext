import React, { Suspense } from 'react';

import CreateServerDialog from '@/app/[locale]/(user)/servers/create-server-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Tran from '@/components/common/tran';
import InternalServerCardSkeleton from '@/components/server/internal-server-card-skeleton';
import { getSession } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import { RequireLogin } from '@/app/[locale]/(user)/servers/require-login';
import { CommunityServer } from '@/app/[locale]/(user)/servers/comunity-server';
import { MeServer } from '@/app/[locale]/(user)/servers/my-server';

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
          <ProtectedElement session={session} alt={<RequireLogin />}>
            <CreateServerDialog />
          </ProtectedElement>
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
