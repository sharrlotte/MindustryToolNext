import React, { Fragment } from 'react';

import ReloadServerButton from '@/app/[locale]/(user)/servers/[id]/reload-server-button';
import ShutdownServerButton from '@/app/[locale]/(user)/servers/[id]/shutdown-server-button';
import StartServerButton from '@/app/[locale]/(user)/servers/[id]/start-server-button';
import ColorText from '@/components/common/color-text';
import RamUsageChart from '@/components/metric/ram-usage-chart';
import getServerApi from '@/query/config/get-server-api';
import RawImage from '@/components/common/raw-image';
import { getInternalServer } from '@/query/server';
import Tran from '@/components/common/tran';
import ServerStatus from '@/components/server/server-status';
import { ServerIcon } from '@/components/common/icons';
import IdUserCard from '@/components/user/id-user-card';
import { getSession } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import ProtectedRoute from '@/layout/protected-route';

type Props = {
  params: { id: string; locale: string };
};

export default async function Page({ params: { id } }: Props) {
  const axios = await getServerApi();

  const [server, session] = await Promise.all([
    getInternalServer(axios, { id }),
    getSession(),
  ]);

  const {
    started,
    name,
    description,
    port,
    mode,
    ramUsage,
    totalRam,
    players,
    mapName,
    mapImage,
    alive,
    userId,
  } = server;

  return (
    <ProtectedRoute session={session} ownerId={userId}>
      <div className="flex flex-col gap-2 overflow-y-auto p-2 md:pl-2">
        <div className="flex flex-col gap-2">
          <div className="flex w-full min-w-80 flex-col gap-6 overflow-hidden bg-card p-4">
            <div className="flex items-center gap-2">
              <ServerIcon className="size-8 rounded-sm bg-foreground p-1 text-background" />
              <ColorText className="text-2xl font-bold" text={name} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm font-medium capitalize">
              <div className="flex flex-col gap-0.5">
                <Tran text="server.description" />
                <ColorText text={description} />
              </div>
              <div className="flex flex-col gap-0.5">
                <Tran text="server.owner" />
                <IdUserCard id={userId} />
              </div>
              <div className="flex flex-col gap-0.5">
                <Tran text="server.game-mode" />
                <span className="capitalize">{mode.toLocaleLowerCase()}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <Tran text="server.status" />
                <ServerStatus alive={alive} started={started} />
              </div>
              <div className="flex flex-col gap-0.5">
                <Tran text="server.players" />
                <span>{players}/30</span>
              </div>
              <div className="flex flex-col gap-0.5">
                {port > 0 && (
                  <Fragment>
                    <Tran text="server.port" />
                    <span>{port}</span>
                  </Fragment>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                {mapName && (
                  <Fragment>
                    <Tran text="server.map" />
                    <ColorText text={mapName} />
                  </Fragment>
                )}
              </div>
            </div>
          </div>
          <div className="flex min-w-60 flex-[3] flex-col gap-1 bg-card p-4 shadow-lg">
            <div>
              <Tran text="server.players" />: <span>{players}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex h-full flex-1 flex-col items-start gap-1 bg-card p-4 shadow-lg">
            <h3 className="text-xl">
              <Tran text="server.system-status" />
            </h3>
            <RamUsageChart ramUsage={ramUsage} totalRam={totalRam} />
            {mapImage && (
              <RawImage className="flex w-full rounded-sm" data={mapImage} />
            )}
          </div>
        </div>
        <ProtectedElement session={session} ownerId={userId}>
          <div className="flex flex-row justify-end gap-2 bg-card p-4 shadow-lg">
            <ReloadServerButton id={id} />
            {started ? (
              <ShutdownServerButton id={id} />
            ) : (
              <StartServerButton id={id} />
            )}
          </div>
        </ProtectedElement>
      </div>
    </ProtectedRoute>
  );
}
