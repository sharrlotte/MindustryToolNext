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
	const title = t('players');

	return {
		title: formatTitle(title),
		alternates: generateAlternate(`/servers/${id}/players`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;

	return <PageClient id={id} />;
}
