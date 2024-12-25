import { Metadata } from 'next';
import React from 'react';

import { DeleteServerButton } from '@/app/[locale]/(user)/servers/[id]/setting/delete-server-button';
import ServerUpdateForm from '@/app/[locale]/(user)/servers/[id]/setting/server-update-form';
import ServerUpdatePortForm from '@/app/[locale]/(user)/servers/[id]/setting/server-update-port-form';

import ErrorScreen from '@/components/common/error-screen';
import RequireLogin from '@/components/common/require-login';
import ScrollContainer from '@/components/common/scroll-container';

import { getSession, serverApi } from '@/action/action';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import ProtectedElement from '@/layout/protected-element';
import { formatTitle, isError } from '@/lib/utils';
import { getInternalServer } from '@/query/server';

type Props = {
  params: Promise<{ id: string; locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = await t(locale, 'setting');

  return {
    title: formatTitle(title),
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const [server, session] = await Promise.all([serverApi((axios) => getInternalServer(axios, { id })), getSession()]);

  if (isError(server)) {
    return <ErrorScreen error={server} />;
  }

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  if (!session) {
    return <RequireLogin />;
  }

  return (
    <ScrollContainer className="flex h-full flex-col gap-2">
      <ServerUpdateForm server={server} />
      <ProtectedElement session={session} filter={{ authority: 'EDIT_ADMIN_SERVER' }}>
        <ServerUpdatePortForm server={server} />
      </ProtectedElement>
      <DeleteServerButton id={id} />
    </ScrollContainer>
  );
}
