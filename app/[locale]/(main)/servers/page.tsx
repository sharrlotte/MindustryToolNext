import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { CommunityServer } from '@/app/[locale]/(main)/servers/community-server';
import CreateServerDialog from '@/app/[locale]/(main)/servers/create-server-dialog';
import { MeServer } from '@/app/[locale]/(main)/servers/my-server';
import { OfficialServer } from '@/app/[locale]/(main)/servers/official-server';

import InternalLink from '@/components/common/internal-link';
import RequireLogin from '@/components/common/require-login';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import ServerCardSkeleton from '@/components/server/server-card-skeleton';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';
import Skeletons from '@/components/ui/skeletons';

import { getSession } from '@/action/action';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import ProtectedElement from '@/layout/protected-element';
import { formatTitle, hasAccess } from '@/lib/utils';

export const experimental_ppr = true;

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ create?: boolean }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, ['common', 'meta']);
  const title = t('server');

  return {
    title: formatTitle(title),
    description: t('meta-server-description'),
    openGraph: {
      title: formatTitle(title),
      description: t('meta-server-description'),
    },
  };
}

function LoginToCreateServer() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <Tran text="server.login-to-create-server" />
      <RequireLogin />
    </div>
  );
}

export default async function Page({ searchParams }: Props) {
  const { create } = await searchParams;
  const session = await getSession();
  const valid = !hasAccess(session, { authority: 'UPDATE_SERVER' });

  return (
    <div className="flex h-full flex-col overflow-hidden space-y-2 p-2">
      <ServerTabs className="flex h-full w-full flex-col overflow-hidden" name="tab" value="official-server" values={['official-server', 'community-server', 'my-server']}>
        <ServerTabsList className="w-full justify-start h-14">
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
          <Suspense fallback={<ServersSkeleton />}>
            <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
              <OfficialServer valid={valid} />
            </ScrollContainer>
          </Suspense>
        </ServerTabsContent>
        <ServerTabsContent className="overflow-hidden" value="community-server">
          <Suspense fallback={<ServersSkeleton />}>
            <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
              <CommunityServer valid={valid} />
            </ScrollContainer>
          </Suspense>
        </ServerTabsContent>
        <ServerTabsContent className="overflow-hidden" value="my-server">
          <Suspense fallback={<ServersSkeleton />}>
            <MyServer />
          </Suspense>
        </ServerTabsContent>
      </ServerTabs>
      <Suspense>
        <Footer create={create} />
      </Suspense>
    </div>
  );
}

async function Footer({ create }: { create?: boolean }) {
  const session = await getSession();

  return (
    <footer className="flex w-full justify-end gap-2">
      <ProtectedElement session={session} filter={true} alt={<RequireLogin />}>
        <InternalLink variant="button-secondary" href="/server-managers">
          <Tran text="server-manager" />
        </InternalLink>
        <CreateServerDialog defaultOpen={!!create} />
      </ProtectedElement>
    </footer>
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

async function MyServer() {
  const session = await getSession();

  return (
    <Suspense fallback={<ServersSkeleton />}>
      <ProtectedElement session={session} filter={true} alt={<LoginToCreateServer />}>
        <ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
          <MeServer />
        </ScrollContainer>
      </ProtectedElement>
    </Suspense>
  );
}
