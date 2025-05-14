import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import LiveLog from '@/app/[locale]/(main)/logs/live-log';

import Tran from '@/components/common/tran';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, generateAlternate } from '@/lib/utils';

type Props = {
	params: Promise<{
		locale: Locale;
	}>;
};

const StaticLog = dynamic(() => import('@/app/[locale]/(main)/logs/static-log'));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('log');

	return {
		title: formatTitle(title),
		alternates: generateAlternate('/logs'),
	};
}

export default function Page() {
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
				<Suspense>
					<LiveLog />
				</Suspense>
			</ServerTabsContent>
			<ServerTabsContent className="h-full" value="static">
				<Suspense>
					<StaticLog />
				</Suspense>
			</ServerTabsContent>
		</ServerTabs>
	);
}
