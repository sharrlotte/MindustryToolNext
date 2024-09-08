import { getSession } from '@/action/action';
import UpdateThumbnail from '@/app/[locale]/(user)/users/@modal/[id]/setting/update-thumbnail';
import React from 'react';

export default async function Page() {
  const session = await getSession();

  return (
    <div className="h-full p-4 overflow-y-auto">
      <UpdateThumbnail id={session.id} />
    </div>
  );
}
