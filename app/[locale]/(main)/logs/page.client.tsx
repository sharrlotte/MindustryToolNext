"use client"
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import LiveLog from '@/app/[locale]/(main)/logs/live-log';

import Tran from '@/components/common/tran';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

const StaticLog = dynamic(() => import('@/app/[locale]/(main)/logs/static-log'));


export default function PageClient() {
	return (
		<ServerTabs className="h-full" value="live" name={'tab'} values={['live', 'static']}>
				<ServerTabsList>
					<ServerTabsTrigger value="live">
						<Tran text="log.live" />
					</ServerTabsTrigger>
					<ServerTabsTrigger value="static">
						<Tran text="log.static" />
					</ServerTabsTrigger>
				</ServerTabsList>
				<ServerTabsContent className="h-full" value="live">
					<LiveLog />
				</ServerTabsContent>
				<ServerTabsContent className="h-full" value="static">
					<Suspense>
						<StaticLog />
					</Suspense>
				</ServerTabsContent>
			</ServerTabs>
	);
}
