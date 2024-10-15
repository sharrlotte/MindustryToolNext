import React, { Fragment, Suspense } from 'react';
import ReloadServerButton from '@/app/[locale]/(user)/servers/[id]/reload-server-button';
import ShutdownServerButton from '@/app/[locale]/(user)/servers/[id]/shutdown-server-button';
import StartServerButton from '@/app/[locale]/(user)/servers/[id]/start-server-button';
import ColorText from '@/components/common/color-text';
import RawImage from '@/components/common/raw-image';
import { getInternalServer, getServerPlayers } from '@/query/server';
import Tran from '@/components/common/tran';
import ServerStatus from '@/components/server/server-status';
import { ServerIcon } from '@/components/common/icons';
import IdUserCard from '@/components/user/id-user-card';
import { getSession, serverApi } from '@/action/action';
import { Player } from '@/types/response/Player';
import { Skeleton } from '@/components/ui/skeleton';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import ErrorScreen from '@/components/common/error-screen';
import ProtectedElement from '@/layout/protected-element';
import { cn, hasAccess, isError } from '@/lib/utils';
import dynamic from 'next/dynamic';

const RamUsageChart = dynamic(() => import('@/components/metric/ram-usage-chart'));

export const experimental_ppr = true;

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

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
      <div className="h-full">
        <div className={cn('grid min-h-full w-full grid-cols-1 grid-rows-[auto_auto_auto_60px] flex-col gap-2 md:grid-cols-[auto_300px] md:grid-rows-[auto_auto_60px]', { 'grid-rows-[auto_auto_60px] md:grid-cols-1': !showPlayer })}>
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
              {mapImage && <RawImage className="flex w-full rounded-sm" data={mapImage} />}
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

type PlayersCardProps = {
  id: string;
};
async function PlayersCard({ id }: PlayersCardProps) {
  const players = await serverApi((axios) => getServerPlayers(axios, id));

  if (isError(players)) {
    return <ErrorScreen error={players} />;
  }

  return (
    <div className="grid gap-1">
      {players
        .sort((a, b) => a.team.name.localeCompare(b.team.name))
        .map((player) => (
          <PlayerCard key={player.uuid} player={player} />
        ))}
    </div>
  );
}

function PlayersCardSkeleton() {
  return Array(10)
    .fill(1)
    .map((_, index) => <Skeleton className="h-10 w-24" key={index} />);
}

type PlayerCardProps = {
  player: Player;
};
async function PlayerCard({ player: { userId, name, team } }: PlayerCardProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex flex-col justify-between gap-1 px-4 py-1 hover:bg-secondary">
          <div className="flex justify-between gap-1">
            <ColorText className="text-lg font-semibold" text={name} />
            {userId && <IdUserCard id={userId} />}
          </div>
          <div className="border-b-2" style={{ borderColor: `#${team.color}` }} />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Tran text="player.info" />
        </ContextMenuItem>
        <ContextMenuItem variant="destructive">
          <Tran text="player.kick" />
        </ContextMenuItem>
        <ContextMenuItem variant="destructive">
          <Tran text="player.ban" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
