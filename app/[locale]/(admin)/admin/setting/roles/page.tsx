import { Metadata } from 'next';
import React from 'react';

import { RoleTable } from '@/app/[locale]/(admin)/admin/setting/role-table';

import { getSession } from '@/action/action';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import ProtectedRoute from '@/layout/protected-route';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = await t('user');

  return {
    title: formatTitle(title),
  };
}

export default async function Page() {
  const session = await getSession();

  return (
    <ProtectedRoute session={session} filter={{ authority: 'EDIT_ROLE_AUTHORITY' }}>
      <RoleTable />
    </ProtectedRoute>
  );
}
