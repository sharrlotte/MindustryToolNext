import { getSession } from '@/action/action';
import UpdateThumbnail from '@/app/[locale]/(user)/users/@modal/[id]/setting/update-thumbnail';
import ErrorScreen from '@/components/common/error-screen';
import RequireLogin from '@/components/common/require-login';
import ProtectedElement from '@/layout/protected-element';
import { isError } from '@/lib/utils';
import React from 'react';

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
      <div className="h-full overflow-y-auto p-2">
        <UpdateThumbnail id={session.id} />
      </div>
    </ProtectedElement>
  );
}
