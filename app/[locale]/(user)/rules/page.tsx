import { Metadata } from 'next';

import RulePage from '@/app/[locale]/(user)/rules/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = t('schematic');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <RulePage />;
}
