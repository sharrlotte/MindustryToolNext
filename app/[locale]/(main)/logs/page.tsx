import { Metadata } from 'next';
import { Suspense } from 'react';

import PageClient from '@/app/[locale]/(main)/logs/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';

type Props = {
	params: Promise<{
		locale: Locale;
	}>;
};

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
		<Suspense>
			<PageClient />
		</Suspense>
	);
}
