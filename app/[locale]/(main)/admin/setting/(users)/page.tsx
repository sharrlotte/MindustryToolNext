import { Metadata } from 'next';
import React from 'react';

import { UserTable } from '@/app/[locale]/(main)/admin/setting/(users)/user-table';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import ProtectedRoute from '@/layout/protected-route';
import { formatTitle, generateAlternate } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = t('user');

  return {
    title: formatTitle(title),
    alternates: generateAlternate('/admin/setting'),
  };
}

export default async function Page() {
  return (
    <ProtectedRoute filter={{ authority: 'EDIT_USER_ROLE' }}>
      <UserTable />
    </ProtectedRoute>
  );
}
