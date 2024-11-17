import React, { Suspense } from 'react';

import { getSession } from '@/action/action';
import { CommunityServer } from '@/app/[locale]/(user)/servers/community-server';
import CreateServerDialog from '@/app/[locale]/(user)/servers/create-server-dialog';
import { MeServer } from '@/app/[locale]/(user)/servers/my-server';
import { OfficialServer } from '@/app/[locale]/(user)/servers/official-server';
import RequireLogin from '@/components/common/require-login';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import InternalServerCardSkeleton from '@/components/server/internal-server-card-skeleton';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';
import ProtectedElement from '@/layout/protected-element';

export const experimental_ppr = true;

const skeleton = (
  <div className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2 overflow-y-auto pr-1">
    {Array(20)
      .fill(1)
      .map((_, index) => (
        <InternalServerCardSkeleton key={index} />
      ))}
  </div>
);

function LoginToCreateServer() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <Tran text="server.login-to-create-server" />
      <RequireLogin />
    </div>
  );
}

export default async function Page() {
  const session = await getSession();

  return (
    <div className="flex h-full flex-col overflow-hidden space-y-2 p-2">
      <ServerTabs className="flex h-full w-full flex-col overflow-hidden" name="tab" value="official-server" values={['official-server', 'community-server', 'my-server']}>
        <ServerTabsList className="w-full justify-start">
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
          <ProtectedElement session={session} filter={true} alt={<LoginToCreateServer />}>
            <Suspense fallback={skeleton}>
              <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2 overflow-y-auto">
                <MeServer />
              </ScrollContainer>
            </Suspense>
          </ProtectedElement>
        </ServerTabsContent>
      </ServerTabs>
      <footer className="flex w-full justify-end">
        <ProtectedElement session={session} filter={true} alt={<RequireLogin />}>
          <CreateServerDialog />
        </ProtectedElement>
      </footer>
    </div>
  );
}
