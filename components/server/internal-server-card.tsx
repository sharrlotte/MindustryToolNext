import Link from 'next/link';
import React from 'react';

import ColorText from '@/components/common/color-text';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';
import Tran from '@/components/common/tran';
import ServerStatus from '@/components/server/server-status';

type ServerInstancesCardProps = {
  server: InternalServerDetail;
};

export default async function InternalServerCard({
  server: { id, name, players, port, alive, started },
}: ServerInstancesCardProps) {
  return (
    <div className="flex h-28 cursor-pointer justify-between rounded-md bg-card p-2">
      <Link className="flex flex-1 flex-col" href={`/servers/${id}`}>
        <ColorText className="text-2xl" text={name} />
        <ServerStatus alive={alive} started={started} />
        <div className="flex justify-between gap-8">
          <div>
            <Tran text="server.players" />: {players}
          </div>
          <div>
            <Tran text="server.port" />: {port}
          </div>
        </div>
      </Link>
    </div>
  );
}
