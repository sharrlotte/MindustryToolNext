import { setStaticParamsLocale } from 'next-international/server';
import React from 'react';

import ReloadServerButton from '@/app/[locale]/admin/servers/[id]/reload-server-button';
import ShutdownServerButton from '@/app/[locale]/admin/servers/[id]/shutdown-server-button';
import StartServerButton from '@/app/[locale]/admin/servers/[id]/start-server-button';
import ColorText from '@/components/common/color-text';
import RamUsageChart from '@/components/metric/ram-usage-chart';
import getServerAPI from '@/query/config/get-server-api';
import getInternalServer from '@/query/server/get-internal-server';

type Props = {
  params: { id: string; locale: string };
};

export default async function Page({ params: { id, locale } }: Props) {
  setStaticParamsLocale(locale);
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
  } = server;

  return (
    <div className="flex flex-col gap-4 p-2 md:p-4 overflow-y-auto">
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-1 p-4 bg-card rounded-lg shadow-lg flex-wrap min-w-60 flex-1">
          <div>
            <span>Name: </span>
            <ColorText text={name} />
          </div>
          <div>
            <span>Description: </span>
            <ColorText text={description} />
          </div>
          <div>
            <span>Port: </span>
            <span>{port}</span>
          </div>
          <div>
            <span>Game mode: </span>
            <span>{mode}</span>
          </div>
          <div>
            <span>Map: </span>
            <span>{mapName}</span>
          </div>
        </div>
        <div className="flex flex-[3] flex-col gap-1 p-4 bg-card rounded-lg shadow-lg min-w-60">
          For testing purpose
          <div>
            <span>Players: </span>
            <span>{players}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="text-xl">System status</div>
        <div className="flex h-full flex-1 flex-col gap-1 p-4 bg-card rounded-lg shadow-lg">
          <RamUsageChart ramUsage={ramUsage} totalRam={totalRam} />
        </div>
      </div>
      <div className="flex flex-row justify-end gap-2 p-4 bg-card rounded-lg shadow-lg">
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
