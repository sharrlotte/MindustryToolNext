import { Metadata } from 'next';
import React from 'react';

import Client from '@/app/[locale]/(main)/plugins/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';
import { ItemPaginationQueryType } from '@/types/schema/search-query';

type Props = {
	searchParams: Promise<ItemPaginationQueryType>;
	params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('plugin');

	return {
		title: formatTitle(title),
		alternates: generateAlternate('/plugins'),
	};
}

export default async function Page() {
	return <Client />;
}
