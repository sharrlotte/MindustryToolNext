import { Metadata } from 'next';
import { Suspense } from 'react';

import ChatPage from '@/app/[locale]/(main)/chat/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, generateAlternate } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = t('chat');

  return {
    title: formatTitle(title),
    alternates: generateAlternate('/chat'),
  };
}

export default function Page() {
  return (
    <Suspense>
      <ChatPage />
    </Suspense>
  );
}
