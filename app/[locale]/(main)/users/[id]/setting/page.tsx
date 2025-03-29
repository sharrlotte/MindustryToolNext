import React from 'react';

import UpdateThumbnail from '@/app/[locale]/(main)/users/[id]/setting/update-thumbnail';
import UserSettings from '@/app/[locale]/(main)/users/[id]/setting/user-settings';

import ErrorScreen from '@/components/common/error-screen';
import RequireLogin from '@/components/common/require-login';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import Divider from '@/components/ui/divider';

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
      <ScrollContainer className="p-4 space-y-8">
        <section className="space-y-4">
          <h3>
            <Tran text="user.profile" asChild />
          </h3>
          <UpdateThumbnail id={session.id} />
        </section>
        <Divider />
        <section className="space-y-4">
          <h3>
            <Tran text="user.setting" asChild />
          </h3>
          <UserSettings />
        </section>
      </ScrollContainer>
    </ProtectedElement>
  );
}
