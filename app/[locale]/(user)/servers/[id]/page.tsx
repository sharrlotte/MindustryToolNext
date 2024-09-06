import React, { Fragment, Suspense } from 'react';

import ReloadServerButton from '@/app/[locale]/(user)/servers/[id]/reload-server-button';
import ShutdownServerButton from '@/app/[locale]/(user)/servers/[id]/shutdown-server-button';
import StartServerButton from '@/app/[locale]/(user)/servers/[id]/start-server-button';
import ColorText from '@/components/common/color-text';
import RamUsageChart from '@/components/metric/ram-usage-chart';
import getServerApi from '@/query/config/get-server-api';
import RawImage from '@/components/common/raw-image';
import { getInternalServer, getServerPlayers } from '@/query/server';
import Tran from '@/components/common/tran';
import ServerStatus from '@/components/server/server-status';
import { ServerIcon } from '@/components/common/icons';
import IdUserCard from '@/components/user/id-user-card';
import { getSession } from '@/action/action';
import ProtectedRoute from '@/layout/protected-route';
import { Player } from '@/types/response/Player';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

import './style.css';

type Props = {
  params: { id: string; locale: string };
};

export const experimental_ppr = true;

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

  if (
    userId === session.id ||
    session.roles.map((role) => role.name).includes('SHAR')
  ) {
    return (
      <ProtectedRoute session={session} ownerId={userId}>
        <div className="flex flex-col gap-2 overflow-y-auto p-2 md:pl-2">
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <div className="server-layout flex w-full flex-col gap-2 [grid-area:info]">
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
                    <span className="capitalize">
                      {mode.toLocaleLowerCase()}
                    </span>
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
              <div className="flex flex-col gap-2 bg-card [grid-area:usage]">
                <div className="flex h-full flex-col items-start gap-1 p-4 shadow-lg">
                  <h3 className="text-xl">
                    <Tran text="server.system-status" />
                  </h3>
                  <RamUsageChart ramUsage={ramUsage} totalRam={totalRam} />
                  {mapImage && (
                    <RawImage
                      className="flex w-full rounded-sm"
                      data={mapImage}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-end gap-2 bg-card p-4 shadow-lg [grid-area:action]">
                <ReloadServerButton id={id} />
                {started ? (
                  <ShutdownServerButton id={id} />
                ) : (
                  <StartServerButton id={id} />
                )}
              </div>
              <div className="flex min-w-40 flex-col gap-1 bg-card shadow-lg [grid-area:player]">
                <div className="flex flex-col gap-2">
                  <h3 className="p-4 text-xl">
                    <Tran text="server.players" /> {players}
                  </h3>
                  <Suspense fallback={<PlayersCardSkeleton />}>
                    <PlayersCard id={id} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
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
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex h-full flex-col items-start gap-1 bg-card p-4 shadow-lg">
          {mapImage && (
            <RawImage className="flex w-full rounded-sm" data={mapImage} />
          )}
        </div>
      </div>
    </div>
  );
}

type PlayersCardProps = {
  id: string;
};
async function PlayersCard({ id }: PlayersCardProps) {
  const axios = await getServerApi();
  const players = await getServerPlayers(axios, id);

  return (
    <div className="grid gap-1">
      {players.map((player) => (
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
          <div
            className="border-b-2"
            style={{ borderColor: `#${team.color}` }}
          />
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
