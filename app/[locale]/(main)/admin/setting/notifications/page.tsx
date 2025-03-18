import { Metadata } from 'next';
import React from 'react';

import PageClient from '@/app/[locale]/(main)/admin/setting/notifications/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, ['common', 'meta']);
  const title = t('logic');

  return {
    title: formatTitle(title),
    description: t('logic-description'),
    openGraph: {
      title: formatTitle(title),
      description: t('logic-description'),
    },
  };
}

export default function Page() {
  return <PageClient />;
}
