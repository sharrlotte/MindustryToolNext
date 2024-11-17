import { Metadata } from 'next';

import { translate } from '@/action/action';
import RulePage from '@/app/[locale]/(user)/rules/page.client';
import { Locale } from '@/i18n/config';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = await translate(locale, 'schematic');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <RulePage />;
}
