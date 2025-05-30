'use client';

import dynamic from 'next/dynamic';
import { ReactNode, Suspense } from 'react';

import LoadingSpinner from '@/components/common/loading-spinner';
import { GridLayout, PaginationFooter, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import Divider from '@/components/ui/divider';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

const PlayerList = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/data/player-list'), {
	ssr: false,
	loading: () => <LoadingSpinner />,
});

const BuildDestroyList = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/data/build-destroy-list'), {
	ssr: false,
	loading: () => <LoadingSpinner />,
});
const BuildDestroyListFooter = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/data/build-destroy-list-footer'), {
	ssr: false,
	loading: () => <LoadingSpinner />,
});
const LoginLogList = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/data/login-log-list'), {
	ssr: false,
	loading: () => <LoadingSpinner />,
});
const LoginLogListFooter = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/data/login-log-list-footer'), {
	ssr: false,
	loading: () => <LoadingSpinner />,
});

const tabs: {
	key: string;
	body: ReactNode;
	footer: ReactNode;
}[] = [
	{
		key: 'login-log',
		body: <LoginLogList />,
		footer: <LoginLogListFooter />,
	},
	{
		key: 'building-destroy-log',
		body: <BuildDestroyList />,
		footer: <BuildDestroyListFooter />,
	},
	{
		key: 'kick-log',
		body: <LoginLogList />,
		footer: <LoginLogListFooter />,
	},
	{
		key: 'player',
		body: <PlayerList />,
		footer: null,
	},
];

export default function PageClient() {
	return (
		<ServerTabs className="gap-2 p-2" name="type" value="login-log" values={tabs.map(({ key }) => key)}>
			<div className="flex justify-between items-center">
				<ServerTabsList className="w-fit rounded-md border">
					{tabs.map(({ key }) => (
						<ServerTabsTrigger key={key} className="h-10" value={key}>
							<Tran text={`server.${key}`} />
						</ServerTabsTrigger>
					))}
				</ServerTabsList>
			</div>
			<Divider />
			<div className="h-full flex flex-col overflow-hidden gap-2">
				<Suspense>
					<ScrollContainer>
						{tabs.map(({ key, body }) => (
							<ServerTabsContent className="space-y-2" key={key} value={key}>
								{body}
							</ServerTabsContent>
						))}
					</ScrollContainer>
				</Suspense>
				<Suspense>
					<PaginationFooter className="ml-auto mt-auto flex">
						<PaginationLayoutSwitcher />
						<GridLayout>
							{tabs.map(({ key, footer }) => (
								<ServerTabsContent className="space-y-2" key={key} value={key}>
									{footer}
								</ServerTabsContent>
							))}
						</GridLayout>
					</PaginationFooter>
				</Suspense>
			</div>
		</ServerTabs>
	);
}
