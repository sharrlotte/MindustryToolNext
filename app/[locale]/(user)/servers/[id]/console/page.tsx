import { Metadata } from 'next';

import ServerConsolePage from '@/app/[locale]/(user)/servers/[id]/console/page.client';

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
  const title = await t(locale, 'console');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <ServerConsolePage />;
}
