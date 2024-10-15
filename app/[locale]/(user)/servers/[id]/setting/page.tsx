import React from 'react';

import { getInternalServer } from '@/query/server';
import ServerUpdateForm from '@/app/[locale]/(user)/servers/[id]/setting/server-update-form';
import ServerUpdatePortForm from '@/app/[locale]/(user)/servers/[id]/setting/server-update-port-form';

import { getSession, serverApi } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import ErrorScreen from '@/components/common/error-screen';
import { isError } from '@/lib/utils';
import RequireLogin from '@/components/common/require-login';
import ScrollContainer from '@/components/common/scroll-container';
import { DeleteServerButton } from '@/app/[locale]/(user)/servers/[id]/setting/delete-server-button';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
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
