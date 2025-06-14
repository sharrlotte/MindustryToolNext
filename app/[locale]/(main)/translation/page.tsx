import { Metadata } from 'next';

import TranslationPage from '@/app/[locale]/(main)/translation/page.client';

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
	const title = t('translation');

	return {
		title: formatTitle(title),
		alternates: generateAlternate(`/translation`),
	};
}

export default function Page() {
	return <TranslationPage />;
}
