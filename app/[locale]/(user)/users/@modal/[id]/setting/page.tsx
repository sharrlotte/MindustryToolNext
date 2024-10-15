import { getSession } from '@/action/action';
import UpdateThumbnail from '@/app/[locale]/(user)/users/@modal/[id]/setting/update-thumbnail';
import ErrorScreen from '@/components/common/error-screen';
import { isError } from '@/lib/utils';
import React from 'react';

export default async function Page() {
  const session = await getSession();

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  return (
    <div className="h-full overflow-y-auto p-2">
      <UpdateThumbnail id={session.id} />
    </div>
  );
}
