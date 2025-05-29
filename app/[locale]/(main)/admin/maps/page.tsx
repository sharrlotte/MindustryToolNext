import { Metadata } from 'next/dist/types';
import { Suspense } from 'react';

import Client from '@/app/[locale]/(main)/admin/maps/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('map');

	return {
		title: formatTitle(title),
		alternates: generateAlternate('/admin/maps'),
	};
}

type Props = {
	params: Promise<{
		locale: Locale;
	}>;
};

export default async function Page() {
	return (
		<Suspense>
			<Client />
		</Suspense>
	);
}
