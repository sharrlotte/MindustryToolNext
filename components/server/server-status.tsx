import React from 'react';

import Tran from '@/components/common/tran';

type Props = {
  alive: boolean;
  started: boolean;
};

export default function ServerStatus({ alive, started }: Props) {
  function render() {
    if (!alive) {
      return <Tran className="text-destructive" text="server.stopped" />;
    }

    if (started) {
      return <Tran className="text-success" text="server.online" />;
    }

    return <Tran className="text-warning" text="server.offline" />;
  }

  return <div className="flex items-center gap-1">{render()}</div>;
}
