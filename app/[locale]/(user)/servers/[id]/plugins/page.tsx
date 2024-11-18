import { Metadata } from 'next';

import ServerPluginPage from '@/app/[locale]/(user)/servers/[id]/plugins/page.client';

import { translate } from '@/action/action';
import { Locale } from '@/i18n/config';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = await translate(locale, 'plugin');

  return {
    title: formatTitle(title),
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <ServerPluginPage id={id} />;
}
