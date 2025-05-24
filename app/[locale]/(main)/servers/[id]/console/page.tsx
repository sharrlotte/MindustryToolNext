import { Metadata } from 'next';
import dynamic from 'next/dynamic';

import ConsoleInput from '@/app/[locale]/(main)/servers/[id]/console/console-input';

import { Skeleton } from '@/components/ui/skeleton';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, generateAlternate } from '@/lib/utils';

const ServerConsolePage = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/console/page.client'), {
	loading: () => <Skeleton className="h-full w-full" />,
});

type Props = {
	params: Promise<{
		locale: Locale;
		id: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id, locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('console');

	return {
		title: formatTitle(title),
		alternates: generateAlternate(`/servers/${id}/console`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;

	return (
		<div className="grid h-full w-full grid-rows-[1fr_auto] overflow-hidden">
			<div className="overflow-x-hidden bg-card">
				<ServerConsolePage />
			</div>
			<ConsoleInput id={id} room={`SERVER-${id}`} />
		</div>
	);
}
