import Link from 'next/link';
import React from 'react';

import ColorText from '@/components/common/color-text';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';

type ServerInstancesCardProps = {
  server: InternalServerDetail;
};

export default async function InternalServerCard({
  server: { id, name, port, alive, started },
}: ServerInstancesCardProps) {
  const status = `Status: ${alive ? 'Alive' : 'Downed'} ${started ? 'Started' : 'Not started'}`;

  return (
    <div className="flex justify-between rounded-md bg-card p-2">
      <Link className="flex flex-1 flex-col" href={`/admin/servers/${id}`}>
        <ColorText className="text-2xl" text={name} />
        <div>Port: {port}</div>
        <div>{status}</div>
      </Link>
    </div>
  );
}
