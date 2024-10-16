import React, { Suspense } from 'react';

import ReloadServerDialog from '@/app/[locale]/(user)/servers/reload-server-dialog';
import CreateServerDialog from '@/app/[locale]/(user)/servers/create-server-dialog';
import Tran from '@/components/common/tran';
import InternalServerCardSkeleton from '@/components/server/internal-server-card-skeleton';
import { getSession } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import { CommunityServer } from '@/app/[locale]/(user)/servers/community-server';
import { MeServer } from '@/app/[locale]/(user)/servers/my-server';
import { OfficialServer } from '@/app/[locale]/(user)/servers/official-server';
import ScrollContainer from '@/components/common/scroll-container';
import RequireLogin from '@/components/common/require-login';
import { ServerTabs, ServerTabsList, ServerTabsTrigger, ServerTabsContent } from '@/components/ui/server-tabs';

const skeleton = (
  <div className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2 overflow-y-auto pr-1">
    {Array(20)
      .fill(1)
      .map((_, index) => (
        <InternalServerCardSkeleton key={index} />
      ))}
  </div>
);
export const experimental_ppr = true;

export default async function Page() {
  const session = await getSession();

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      <ServerTabs className="flex h-full w-full flex-col overflow-hidden" name="tab" value="official-server" values={['official-server', 'community-server', 'my-server']}>
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div>
            <ServerTabsList>
              <ServerTabsTrigger value="official-server">
                <Tran text="server.official-server" />
              </ServerTabsTrigger>
              <ServerTabsTrigger value="community-server">
                <Tran text="server.community-server" />
              </ServerTabsTrigger>
              <ServerTabsTrigger value="my-server">
                <Tran text="server.my-server" />
              </ServerTabsTrigger>
            </ServerTabsList>
          </div>
          <div className='space-x-2'>
            <ProtectedElement session={session} filter={true} alt={<RequireLogin />}>
              <ReloadServerDialog />
              <CreateServerDialog />
            </ProtectedElement>
          </div>
        </div>
        <ServerTabsContent className="overflow-hidden" value="official-server">
          <Suspense fallback={skeleton}>
            <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2 overflow-y-auto">
              <OfficialServer />
            </ScrollContainer>
          </Suspense>
        </ServerTabsContent>
        <ServerTabsContent className="overflow-hidden" value="community-server">
          <Suspense fallback={skeleton}>
            <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2 overflow-y-auto">
              <CommunityServer />
            </ScrollContainer>
          </Suspense>
        </ServerTabsContent>
        <ServerTabsContent className="overflow-hidden" value="my-server">
          <ProtectedElement session={session} filter={true} alt={<RequireLogin />}>
            <Suspense fallback={skeleton}>
              <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2 overflow-y-auto">
                <MeServer />
              </ScrollContainer>
            </Suspense>
          </ProtectedElement>
        </ServerTabsContent>
      </ServerTabs>
    </div>
  );
}
