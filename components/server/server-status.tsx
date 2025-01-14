import React from 'react';

import Tran from '@/components/common/tran';
import { Badge } from '@/components/ui/badge';

type Props = {
  alive: boolean;
  started: boolean;
};

export default function ServerStatus({ alive, started }: Props) {
  function render() {
    if (!alive) {
      return (
        <Badge variant="destructive">
          <Tran text="server.stopped" asChild />
        </Badge>
      );
    }

    if (started) {
      return (
        <Badge variant="success">
          <Tran text="server.online" asChild />
        </Badge>
      );
    }

    return (
      <Badge variant="secondary">
        <Tran text="server.offline" asChild />
      </Badge>
    );
  }

  return <div>{render()}</div>;
}
