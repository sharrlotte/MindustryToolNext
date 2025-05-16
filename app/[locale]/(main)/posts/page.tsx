import { Metadata } from 'next';

import Client from '@/app/[locale]/(main)/posts/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, generateAlternate } from '@/lib/utils';
import { ItemPaginationQueryType } from '@/types/schema/search-query';

type Props = {
	searchParams: Promise<ItemPaginationQueryType>;
	params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const { t } = await getTranslation(locale, ['common', 'meta']);
	const title = t('post');

	return {
		title: formatTitle(title),
		description: t('server-description'),
		openGraph: {
			title: formatTitle(title),
			description: t('server-description'),
		},
		alternates: generateAlternate('/posts'),
	};
}

export default async function Page() {
	return <Client />;
}
