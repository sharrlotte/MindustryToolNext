import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { Fragment, Suspense, cache } from 'react';

import CheckServerMaps from '@/app/[locale]/(user)/servers/[id]/(dashboard)/check-server-maps';
import { PlayersCard, PlayersCardSkeleton } from '@/app/[locale]/(user)/servers/[id]/(dashboard)/player-card';
import HostServerButton from '@/app/[locale]/(user)/servers/[id]/host-server-button';
import InitServerButton from '@/app/[locale]/(user)/servers/[id]/init-server-button';
import RemoveServerButton from '@/app/[locale]/(user)/servers/[id]/remove-server-button';
import ShutdownServerButton from '@/app/[locale]/(user)/servers/[id]/shutdown-server-button';
import StopServerButton from '@/app/[locale]/(user)/servers/[id]/stop-server-button';

import CopyButton from '@/components/button/copy-button';
import ColorText from '@/components/common/color-text';
import ErrorScreen from '@/components/common/error-screen';
import { ServerIcon } from '@/components/common/icons';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import ServerStatus from '@/components/server/server-status';
import IdUserCard from '@/components/user/id-user-card';

import { getSession, serverApi } from '@/action/action';
import env from '@/constant/env';
import ProtectedElement from '@/layout/protected-element';
import { cn, formatTitle, hasAccess, isError } from '@/lib/utils';
import { getServer } from '@/query/server';

const RamUsageChart = dynamic(() => import('@/components/metric/ram-usage-chart'));

export const experimental_ppr = true;

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export const getCachedServer = cache((id: string) => serverApi(async (axios) => await getServer(axios, { id })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const server = await getCachedServer(id);

  if (isError(server)) {
    return { title: 'Error' };
  }

  const { name, description } = server;

  return {
    title: formatTitle(name),
    description,
    openGraph: {
      title: formatTitle(name),
      description,
      images: `${env.url.api}/servers/${id}/image`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const [server, session] = await Promise.all([getCachedServer(id), getSession()]);

  if (isError(server)) {
    return <ErrorScreen error={server} />;
  }

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  const { name, description, port, mode, ramUsage, totalRam, players, mapName, status, userId, address } = server;

  const canAccess = hasAccess(session, { any: [{ authority: 'VIEW_ADMIN_SERVER' }, { authorId: server.userId }] });
  const showPlayer = hasAccess(session, {
    all: [canAccess, status === 'HOST'],
  });

  return (
    <ScrollContainer className="flex flex-col gap-2 h-full">
      <CheckServerMaps id={id} />
      <div className="h-full">
        <div
          className={cn('grid min-h-full w-full grid-cols-1 grid-rows-[auto_auto_60px] flex-col gap-2 md:grid-cols-[auto_300px] md:grid-rows-[auto_auto_60px]', {
            'grid-rows-[auto_auto_60px] md:grid-cols-1': !showPlayer,
            'grid-rows-[auto_auto_auto_60px]': canAccess,
          })}
        >
          <div className="col-span-1 flex w-full min-w-80 flex-col gap-6 overflow-hidden bg-card rounded-md p-4">
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
                <ServerStatus status={status} />
              </div>
              <div className="flex flex-col gap-0.5">
                <Tran text="server.players" />
                <span>{players}/30</span>
              </div>
              <div className="flex flex-col gap-0.5">
                {mapName && (
                  <Fragment>
                    <Tran text="server.map" />
                    <ColorText text={mapName} />
                  </Fragment>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                {address && (
                  <div className="flex gap-1 flex-col">
                    <Tran text="server.address" />
                    <CopyButton variant="ghost" data={`${address}:${port}`} />
                    <span className="lowercase">
                      {address}:{port}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2 bg-card rounded-md md:col-start-1 md:row-start-2">
            <div className="flex h-full flex-col items-start justify-start gap-1 p-4 shadow-lg">
              <h3 className="text-xl">
                <Tran text="server.system-status" />
              </h3>
              {status === 'HOST' ? (
                <>
                  <RamUsageChart ramUsage={ramUsage} totalRam={totalRam} />
                  <Image key={status} className="flex max-w-[50dvw] h-auto rounded-sm landscape:max-h-[50dvh] landscape:max-w-none" src={`${env.url.api}/servers/${id}/image`} alt={name} width={500} height={500} />
                </>
              ) : (
                <Tran text="server.server-is-not-running" />
              )}
            </div>
          </div>
          <ProtectedElement session={session} filter={showPlayer}>
            <div className="col-start-1 row-start-3 flex min-w-40 flex-col gap-1 bg-card rounded-md shadow-lg md:col-start-2 md:row-span-3 md:row-start-1">
              <div className="flex flex-col gap-2">
                <h3 className="p-4 text-xl">
                  <Tran text="server.players" /> {players}
                </h3>
                {status === 'HOST' && (
                  <Suspense fallback={<PlayersCardSkeleton players={players} />}>
                    <PlayersCard id={id} />
                  </Suspense>
                )}
              </div>
            </div>
          </ProtectedElement>
          <ProtectedElement session={session} filter={canAccess}>
            <div className={cn('col-start-1 row-start-4 flex flex-row items-center justify-end gap-2 bg-card rounded-md p-2 shadow-lg md:row-start-3', { 'row-start-3': !showPlayer })}>
              {status !== 'HOST' && <RemoveServerButton id={id} />}
              {status !== 'DOWN' && <ShutdownServerButton id={id} />}
              {status === 'HOST' ? <StopServerButton id={id} /> : status === 'UP' ? <HostServerButton id={id} /> : <InitServerButton id={id} />}
            </div>
          </ProtectedElement>
        </div>
      </div>
    </ScrollContainer>
  );
}
