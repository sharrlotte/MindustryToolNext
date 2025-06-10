'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { LogPathIcon } from '@/app/[locale]/(main)/log-path';
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
					<LogPathIcon>
						<Tran text="log.error" />
					</LogPathIcon>
				</ServerTabsTrigger>
			</ServerTabsList>
			<ServerTabsContent value="live" className="overflow-hidden">
				<LiveLog />
			</ServerTabsContent>
			<ServerTabsContent value="static" className="overflow-hidden">
				<Suspense>
					<StaticLog />
				</Suspense>
			</ServerTabsContent>
			<ServerTabsContent value="error" className="overflow-hidden">
				<Suspense>
					<ErrorLog />
				</Suspense>
			</ServerTabsContent>
		</ServerTabs>
	);
}
