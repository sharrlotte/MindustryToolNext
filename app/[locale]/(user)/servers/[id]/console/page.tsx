import { Metadata } from 'next';

import { translate } from '@/action/action';
import ServerConsolePage from '@/app/[locale]/(user)/servers/[id]/console/page.client';
import { Locale } from '@/i18n/config';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = await translate(locale, 'console');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <ServerConsolePage />;
}
