import { Metadata } from 'next';
import { Suspense } from 'react';

import ServerMaps from '@/app/[locale]/(main)/servers/[id]/maps/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';

type Props = {
	params: Promise<{
		locale: Locale;
		id: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id, locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('map');

	return {
		title: formatTitle(title),
		alternates: generateAlternate(`/servers/${id}/maps`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;
	return (
		<Suspense>
			<ServerMaps id={id} />
		</Suspense>
	);
}
