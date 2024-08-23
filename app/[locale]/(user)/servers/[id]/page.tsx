import React from 'react';

import ReloadServerButton from '@/app/[locale]/(user)/servers/[id]/reload-server-button';
import ShutdownServerButton from '@/app/[locale]/(user)/servers/[id]/shutdown-server-button';
import StartServerButton from '@/app/[locale]/(user)/servers/[id]/start-server-button';
import ColorText from '@/components/common/color-text';
import RamUsageChart from '@/components/metric/ram-usage-chart';
import getServerAPI from '@/query/config/get-server-api';
import RawImage from '@/components/common/raw-image';
import { getInternalServer } from '@/query/server';
import Tran from '@/components/common/tran';

type Props = {
  params: { id: string; locale: string };
};

export default async function Page({ params: { id } }: Props) {
  const axios = await getServerAPI();
  const server = await getInternalServer(axios, { id });

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
  } = server;

  return (
    <div className="flex flex-col gap-2 overflow-y-auto p-2 md:pl-2">
      <div className="flex flex-wrap gap-2">
        <div className="flex min-w-60 flex-1 flex-col flex-wrap gap-1 bg-card p-4 shadow-lg">
          <ColorText className="text-xl font-bold" text={name} />
          <ColorText text={description} />
          <div>
            <Tran text="server.port" />: <span>{port}</span>
          </div>
          <div>
            <Tran text="server.gamemode" />: <span>{mode}</span>
          </div>
          <div>
            <Tran text="server.map-name" />: <span>{mapName}</span>
          </div>
          {!alive ? (
            <div className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-destructive" />
              <Tran text="server.stopped" />
            </div>
          ) : started ? (
            <div className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-success" />
              <Tran text="server.online" />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-warning" />
              <Tran text="server.offline" />
            </div>
          )}
        </div>
        <div className="flex min-w-60 flex-[3] flex-col gap-1 bg-card p-4 shadow-lg">
          <div>
            <Tran text="server.players" />: <span>{players}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex h-full flex-1 flex-col items-start gap-1 bg-card p-4 shadow-lg">
          <h3 className="text-xl">System status</h3>
          <RamUsageChart ramUsage={ramUsage} totalRam={totalRam} />
          {mapImage && (
            <RawImage className="flex w-full rounded-sm" data={mapImage} />
          )}
        </div>
      </div>
      <div className="flex flex-row justify-end gap-2 bg-card p-4 shadow-lg">
        <ReloadServerButton id={id} />
        {started ? (
          <ShutdownServerButton id={id} />
        ) : (
          <StartServerButton id={id} />
        )}
      </div>
    </div>
  );
}
