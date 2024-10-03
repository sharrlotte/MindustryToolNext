import React from 'react';

import { getInternalServer } from '@/query/server';
import ServerUpdateForm from '@/app/[locale]/(user)/servers/[id]/setting/server-update-form';
import ServerUpdatePortForm from '@/app/[locale]/(user)/servers/[id]/setting/server-update-port-form';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Tran from '@/components/common/tran';
import { getSession, serverApi } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import { Hidden } from '@/components/common/hidden';
import ErrorScreen from '@/components/common/error-screen';

type PageProps = {
  params: { id: string };
};

export default async function Page({ params: { id } }: PageProps) {
  const [server, session] = await Promise.all([
    serverApi((axios) => getInternalServer(axios, { id })),
    getSession(),
  ]);

  if ('error' in server) {
    return <ErrorScreen error={server} />;
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto p-2">
      <ProtectedElement session={session} all={['SHAR']}>
        <Dialog>
          <div className="flex bg-card p-2">
            <DialogTrigger asChild>
              <Button className="ml-auto" variant="secondary">
                <Tran text="server.update-port" />
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
