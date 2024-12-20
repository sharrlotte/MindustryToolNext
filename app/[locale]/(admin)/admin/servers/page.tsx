import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { CommunityServer } from '@/app/[locale]/(user)/servers/community-server';
import CreateServerDialog from '@/app/[locale]/(user)/servers/create-server-dialog';
import { MeServer } from '@/app/[locale]/(user)/servers/my-server';
import { OfficialServer } from '@/app/[locale]/(user)/servers/official-server';
import ReloadServerDialog from '@/app/[locale]/(user)/servers/reload-server-dialog';

import RequireLogin from '@/components/common/require-login';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import InternalServerCardSkeleton from '@/components/server/internal-server-card-skeleton';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

import { getSession, translate } from '@/action/action';
import { Locale } from '@/i18n/config';
import ProtectedElement from '@/layout/protected-element';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = await translate(locale, 'server');

  return {
    title: formatTitle(title),
  };
}

const skeleton = (
  <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
    {Array(20)
      .fill(1)
      .map((_, index) => (
        <InternalServerCardSkeleton key={index} />
      ))}
  </ScrollContainer>
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
          <div className="space-x-2">
            <ProtectedElement session={session} filter={true} alt={<RequireLogin />}>
              <ReloadServerDialog />
              <CreateServerDialog />
            </ProtectedElement>
          </div>
        </div>
        <ServerTabsContent className="overflow-hidden" value="official-server">
          <Suspense fallback={skeleton}>
            <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
              <OfficialServer />
            </ScrollContainer>
          </Suspense>
        </ServerTabsContent>
        <ServerTabsContent className="overflow-hidden" value="community-server">
          <Suspense fallback={skeleton}>
            <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
              <CommunityServer />
            </ScrollContainer>
          </Suspense>
        </ServerTabsContent>
        <ServerTabsContent className="overflow-hidden" value="my-server">
          <ProtectedElement session={session} filter={true} alt={<RequireLogin />}>
            <Suspense fallback={skeleton}>
              <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
                <MeServer />
              </ScrollContainer>
            </Suspense>
          </ProtectedElement>
        </ServerTabsContent>
      </ServerTabs>
    </div>
  );
}
