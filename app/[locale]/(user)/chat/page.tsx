import { Metadata } from 'next';

import ChatPage from '@/app/[locale]/(user)/chat/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};
export const experimental_ppr = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = await t('chat');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <ChatPage />;
}
