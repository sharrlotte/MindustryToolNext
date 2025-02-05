import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { CommunityAdminServer } from '@/app/[locale]/(admin)/admin/servers/community-admin-server';
import { OfficialAdminServer } from '@/app/[locale]/(admin)/admin/servers/official-admin-server';
import CreateServerDialog from '@/app/[locale]/(user)/servers/create-server-dialog';

import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import ServerCardSkeleton from '@/components/server/server-card-skeleton';
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
  const title = await t('server');

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
            <CreateServerDialog />
          </div>
        </div>
        <ServerTabsContent className="overflow-hidden" value="official-server">
          <Suspense fallback={<ServersSkeleton />}>
            <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
              <OfficialAdminServer />
            </ScrollContainer>
          </Suspense>
        </ServerTabsContent>
        <ServerTabsContent className="overflow-hidden" value="community-server">
          <Suspense fallback={<ServersSkeleton />}>
            <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
              <CommunityAdminServer />
            </ScrollContainer>
          </Suspense>
        </ServerTabsContent>
      </ServerTabs>
    </div>
  );
}
async function ServersSkeleton() {
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
      <Skeletons number={20}>
        <ServerCardSkeleton />
      </Skeletons>
    </div>
  );
}
