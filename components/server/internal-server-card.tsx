import React, { Fragment } from 'react';

import ColorText from '@/components/common/color-text';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';
import Tran from '@/components/common/tran';
import ServerStatus from '@/components/server/server-status';
import { ServerIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';

type MyServerInstancesCardProps = {
  server: InternalServerDetail;
};

export default async function InternalServerCard({
  server: { id, name, players, port, alive, started, mapName, mode },
}: MyServerInstancesCardProps) {
  return (
    <InternalLink
      className="flex h-full flex-1 cursor-pointer flex-col gap-4 rounded-md bg-card p-2"
      href={`/servers/${id}`}
    >
      <div className="flex items-center gap-2">
        <ServerIcon className="size-8 rounded-sm bg-foreground p-1 text-background" />
        <ColorText className="text-2xl font-bold" text={name} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm font-medium capitalize">
        <div className="flex flex-col gap-0.5">
          <Tran text="server.status" />
          <ServerStatus alive={alive} started={started} />
        </div>
        <div className="flex flex-col gap-0.5">
          <Tran text="server.game-mode" />
          <span className="capitalize">{mode.toLocaleLowerCase()}</span>
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
    </InternalLink>
  );
}
