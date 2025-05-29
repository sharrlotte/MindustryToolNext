import { Metadata } from 'next';

import RulePage from '@/app/[locale]/(main)/rules/page.client';

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
	const title = t('rule');

	return {
		title: formatTitle(title),
		alternates: generateAlternate('/rules'),
	};
}

export default function Page() {
	return <RulePage />;
}
