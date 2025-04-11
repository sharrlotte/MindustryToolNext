import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';


import RequireLogin from '@/components/common/require-login';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, generateAlternate } from '@/lib/utils';
import ServerFooter from '@/app/[locale]/(main)/servers/page.footer';
import ClientProtectedElement from '@/layout/client-protected-element';
import ServersSkeleton from '@/app/[locale]/(main)/servers/servers-skeleton';
import OfficialServer from '@/app/[locale]/(main)/servers/official-server';

const MeServer = dynamic(() => import('@/app/[locale]/(main)/servers/my-server'));
const CommunityServer = dynamic(() => import('@/app/[locale]/(main)/servers/community-server'));

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
		description: t('server-description'),
		openGraph: {
			title: formatTitle(title),
			description: t('server-description'),
		},
		alternates: generateAlternate('/servers'),
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

	return (
		<div className="flex h-full flex-col overflow-hidden space-y-2 p-2">
			<ServerTabs className="flex h-full w-full flex-col overflow-hidden" name="tab" value="official-server" values={['official-server', 'community-server', 'my-server']}>
				<ServerTabsList className="w-full justify-start h-14 min-h-14">
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
					<ScrollContainer >
						<Suspense fallback={<ServersSkeleton />}>
							<OfficialServer />
						</Suspense>
					</ScrollContainer>
				</ServerTabsContent>
				<ServerTabsContent className="overflow-hidden" value="community-server">
					<ScrollContainer>
						<Suspense fallback={<ServersSkeleton />}>
							<CommunityServer />
						</Suspense>
					</ScrollContainer>
				</ServerTabsContent>
				<ServerTabsContent className="overflow-hidden" value="my-server">
					<ClientProtectedElement filter alt={<LoginToCreateServer />}>
						<ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
							<Suspense fallback={<ServersSkeleton />}>
								<MeServer />
							</Suspense>
						</ScrollContainer>
					</ClientProtectedElement>
				</ServerTabsContent>
			</ServerTabs>
			<Suspense>
				<ServerFooter create={create} />
			</Suspense>
		</div>
	);
}
