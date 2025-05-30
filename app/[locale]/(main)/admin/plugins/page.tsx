import { Metadata } from 'next/dist/types';

import Client from '@/app/[locale]/(main)/admin/plugins/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('plugin');

	return {
		title: formatTitle(title),
		alternates: generateAlternate('/admin/plugins'),
	};
}

type Props = {
	params: Promise<{ locale: Locale }>;
};

export default async function Page() {
	return <Client />;
}
