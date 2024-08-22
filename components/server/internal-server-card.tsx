import Link from 'next/link';
import React, { Fragment } from 'react';

import ColorText from '@/components/common/color-text';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';
import Tran from '@/components/common/tran';

type ServerInstancesCardProps = {
  server: InternalServerDetail;
};

export default async function InternalServerCard({
  server: { id, name, players, port, alive, started },
}: ServerInstancesCardProps) {
  return (
    <div className="flex cursor-pointer justify-between rounded-md bg-card p-2">
      <Link className="flex flex-1 flex-col" href={`/servers/${id}`}>
        <ColorText className="text-2xl" text={name} />
        <div>Port: {port}</div>
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
            <span className="bg-warning size-2 rounded-full" />
            <Tran text="server.offline" />
          </div>
        )}
        <div>Player: {players}</div>
      </Link>
    </div>
  );
}
