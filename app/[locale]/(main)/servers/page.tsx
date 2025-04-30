import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

import ServerList from '@/app/[locale]/(main)/servers/server-list';
import ServerFooter from '@/app/[locale]/(main)/servers/page.footer';
import ServersSkeleton from '@/app/[locale]/(main)/servers/servers.skeleton';

import RequireLogin from '@/components/common/require-login';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import ClientProtectedElement from '@/layout/client-protected-element';
import { formatTitle, generateAlternate } from '@/lib/utils';

const MeServer = dynamic(() => import('@/app/[locale]/(main)/servers/my-server'));

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
			<ServerTabs
				className="flex h-full w-full flex-col overflow-hidden"
				name="tab"
				value="server-list"
				values={['server-list', 'my-server']}
			>
				<ServerTabsList className="w-full justify-start h-14 min-h-14">
					<ServerTabsTrigger value="server-list">
						<Tran text="server.server-list" />
					</ServerTabsTrigger>
					<ServerTabsTrigger value="my-server">
						<Tran text="server.my-server" />
					</ServerTabsTrigger>
				</ServerTabsList>
				<ServerTabsContent className="overflow-hidden" value="server-list">
					<ScrollContainer>
						<Suspense fallback={<ServersSkeleton />}>
							<ServerList />
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
