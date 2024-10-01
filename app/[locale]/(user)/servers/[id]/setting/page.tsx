import React from 'react';

import { getInternalServer } from '@/query/server';
import ServerUpdateForm from '@/app/[locale]/(user)/servers/[id]/setting/server-update-form';
import ServerUpdatePortForm from '@/app/[locale]/(user)/servers/[id]/setting/server-update-port-form';
import getServerApi from '@/query/config/get-server-api';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Tran from '@/components/common/tran';
import { getSession } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import { Hidden } from '@/components/common/hidden';

type PageProps = {
  params: { id: string };
};

export default async function Page({ params: { id } }: PageProps) {
  const axios = await getServerApi();
  const server = await getInternalServer(axios, { id });
  const session = await getSession();

  return (
    <div className="flex flex-col gap-2 p-2">
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
