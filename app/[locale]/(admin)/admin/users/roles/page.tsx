import { Metadata } from 'next';
import React from 'react';

import { RoleTable } from '@/app/[locale]/(admin)/admin/users/role-table';

import { getSession, translate } from '@/action/action';
import { Locale } from '@/i18n/config';
import ProtectedRoute from '@/layout/protected-route';
import { formatTitle } from '@/lib/utils';

export const experimental_ppr = true;

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = await translate(locale, 'user');

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
