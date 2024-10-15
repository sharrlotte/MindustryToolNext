import React from 'react';

import { getInternalServer } from '@/query/server';
import ServerUpdateForm from '@/app/[locale]/(user)/servers/[id]/setting/server-update-form';
import ServerUpdatePortForm from '@/app/[locale]/(user)/servers/[id]/setting/server-update-port-form';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Tran from '@/components/common/tran';
import { getSession, serverApi } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import { Hidden } from '@/components/common/hidden';
import ErrorScreen from '@/components/common/error-screen';
import { isError } from '@/lib/utils';
import RequireLogin from '@/components/common/require-login';

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
    <div className="flex h-full flex-col gap-2 p-2">
      <ProtectedElement session={session} filter={{ any: [{ authority: 'EDIT_ADMIN_SERVER' }, { authorId: session.id }] }}>
        <Dialog>
          <div className="flex bg-card p-2">
            <DialogTrigger asChild>
              <Button className="ml-auto" variant="secondary">
                <Tran text="server.update" />
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent>
            <Hidden>
              <DialogTitle />
            </Hidden>
            <ServerUpdatePortForm server={server} />
          </DialogContent>
        </Dialog>
      </ProtectedElement>
      <ServerUpdateForm server={server} />
    </div>
  );
}
