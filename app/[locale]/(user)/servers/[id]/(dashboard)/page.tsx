import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import React, { Fragment, Suspense } from 'react';

import { getSession, serverApi, translate } from '@/action/action';
import CheckServerMaps from '@/app/[locale]/(user)/servers/[id]/(dashboard)/check-server-maps';
import { PlayersCard, PlayersCardSkeleton } from '@/app/[locale]/(user)/servers/[id]/(dashboard)/player-card';
import ReloadServerButton from '@/app/[locale]/(user)/servers/[id]/reload-server-button';
import ShutdownServerButton from '@/app/[locale]/(user)/servers/[id]/shutdown-server-button';
import StartServerButton from '@/app/[locale]/(user)/servers/[id]/start-server-button';
import ColorText from '@/components/common/color-text';
import ErrorScreen from '@/components/common/error-screen';
import { ServerIcon } from '@/components/common/icons';
import RawImage from '@/components/common/raw-image';
import Tran from '@/components/common/tran';
import ServerStatus from '@/components/server/server-status';
import IdUserCard from '@/components/user/id-user-card';
import ProtectedElement from '@/layout/protected-element';
import { cn, formatTitle, hasAccess, isError } from '@/lib/utils';
import { getInternalServer } from '@/query/server';

const RamUsageChart = dynamic(() => import('@/components/metric/ram-usage-chart'));

export const experimental_ppr = true;

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = await translate(locale, 'dashboard');

  return {
    title: formatTitle(title),
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const [server, session] = await Promise.all([serverApi((axios) => getInternalServer(axios, { id })), getSession()]);

  if (isError(server)) {
    return <ErrorScreen error={server} />;
  }

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  const { started, name, description, port, mode, ramUsage, totalRam, players, mapName, mapImage, alive, userId } = server;

  const showPlayer = hasAccess(session, {
    all: [
      {
        any: [
          {
            authorId: userId,
          },
          { authority: 'VIEW_ADMIN_SERVER' },
        ],
      },
      started,
      false,
    ],
  });

  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      <CheckServerMaps id={id} />
      <div className="h-full">
        <div
          className={cn('grid min-h-full w-full grid-cols-1 grid-rows-[auto_auto_auto_60px] flex-col gap-2 md:grid-cols-[auto_300px] md:grid-rows-[auto_auto_60px]', {
            'grid-rows-[auto_auto_60px] md:grid-cols-1': !showPlayer,
          })}
        >
          <div className="col-span-1 flex w-full min-w-80 flex-col gap-6 overflow-hidden bg-card p-4">
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
          <div className="col-span-1 flex flex-col gap-2 bg-card md:col-start-1 md:row-start-2">
            <div className="flex h-full flex-col items-start gap-1 p-4 shadow-lg">
              <h3 className="text-xl">
                <Tran text="server.system-status" />
              </h3>
              <RamUsageChart ramUsage={ramUsage} totalRam={totalRam} />
              {mapImage && <RawImage className="flex w-full max-w-[50dvw] rounded-sm landscape:max-h-[50dvh] landscape:max-w-none" data={mapImage} />}
            </div>
          </div>
          <div className={cn('col-start-1 row-start-4 flex flex-row items-center justify-end gap-2 bg-card p-2 shadow-lg md:row-start-3', { 'row-start-3': !showPlayer })}>
            <ReloadServerButton id={id} />
            {started ? <ShutdownServerButton id={id} /> : <StartServerButton id={id} />}
          </div>
          <ProtectedElement session={session} filter={showPlayer}>
            <div className="col-start-1 row-start-3 flex min-w-40 flex-col gap-1 bg-card shadow-lg md:col-start-2 md:row-span-3 md:row-start-1">
              <div className="flex flex-col gap-2">
                <h3 className="p-4 text-xl">
                  <Tran text="server.players" /> {players}
                </h3>
                <Suspense fallback={<PlayersCardSkeleton />}>
                  <PlayersCard id={id} />
                </Suspense>
              </div>
            </div>
          </ProtectedElement>
        </div>
      </div>
    </div>
  );
}
