import React from 'react';

import UpdateThumbnail from '@/app/[locale]/(user)/users/@modal/[id]/setting/update-thumbnail';

import ErrorScreen from '@/components/common/error-screen';
import RequireLogin from '@/components/common/require-login';
import ScrollContainer from '@/components/common/scroll-container';

import { getSession } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import { isError } from '@/lib/utils';

export default async function Page() {
  const session = await getSession();

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  if (!session) {
    return <RequireLogin />;
  }

  return (
    <ProtectedElement session={session} filter={true}>
      <ScrollContainer>
        <UpdateThumbnail id={session.id} />
      </ScrollContainer>
    </ProtectedElement>
  );
}
