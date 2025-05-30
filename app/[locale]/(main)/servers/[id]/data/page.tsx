import { Metadata } from 'next';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';

import PageClient from './page.client';

type Props = {
	params: Promise<{
		locale: Locale;
		id: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id, locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('data');

	return {
		title: formatTitle(title),
		alternates: generateAlternate(`/servers/${id}/data`),
	};
}

export default async function Page() {
	return <PageClient />;
}
