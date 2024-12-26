import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { CommunityServer } from '@/app/[locale]/(user)/servers/community-server';
import CreateServerDialog from '@/app/[locale]/(user)/servers/create-server-dialog';
import { OfficialServer } from '@/app/[locale]/(user)/servers/official-server';
import ReloadServerDialog from '@/app/[locale]/(user)/servers/reload-server-dialog';

import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import InternalServerCardSkeleton from '@/components/server/internal-server-card-skeleton';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';
import Skeletons from '@/components/ui/skeletons';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = await t(locale, 'server');

  return {
    title: formatTitle(title),
  };
}

export const experimental_ppr = true;

export default async function Page() {
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
            </ServerTabsList>
          </div>
          <div className="space-x-2">
            <ReloadServerDialog />
            <CreateServerDialog />
          </div>
        </div>
        <Suspense fallback={<ServersSkeleton />}>
          <ServerTabsContent className="overflow-hidden" value="official-server">
            <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
              <OfficialServer />
            </ScrollContainer>
          </ServerTabsContent>
        </Suspense>
        <Suspense fallback={<ServersSkeleton />}>
          <ServerTabsContent className="overflow-hidden" value="community-server">
            <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
              <CommunityServer />
            </ScrollContainer>
          </ServerTabsContent>
        </Suspense>
      </ServerTabs>
    </div>
  );
}
async function ServersSkeleton() {
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
      <Skeletons number={20}>
        <InternalServerCardSkeleton />
      </Skeletons>
    </div>
  );
}
