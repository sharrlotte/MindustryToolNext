'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import LiveLog from '@/app/[locale]/(main)/logs/live-log';

import Tran from '@/components/common/tran';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

const StaticLog = dynamic(() => import('@/app/[locale]/(main)/logs/static-log'), { ssr: false });
const ErrorLog = dynamic(() => import('@/app/[locale]/(main)/logs/error-log'), { ssr: false });

export default function PageClient() {
	return (
		<ServerTabs className="h-full" value="live" name={'tab'} values={['live', 'static', 'error']}>
			<ServerTabsList>
				<ServerTabsTrigger value="live">
					<Tran text="log.live" />
				</ServerTabsTrigger>
				<ServerTabsTrigger value="static">
					<Tran text="log.static" />
				</ServerTabsTrigger>
				<ServerTabsTrigger value="error">
					<Tran text="log.error" />
				</ServerTabsTrigger>
			</ServerTabsList>
			<ServerTabsContent value="live">
				<LiveLog />
			</ServerTabsContent>
			<ServerTabsContent value="static">
				<Suspense>
					<StaticLog />
				</Suspense>
			</ServerTabsContent>
			<ServerTabsContent value="error">
				<Suspense>
					<ErrorLog />
				</Suspense>
			</ServerTabsContent>
		</ServerTabs>
	);
}
