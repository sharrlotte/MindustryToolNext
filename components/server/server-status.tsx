import React from 'react';

import Tran from '@/components/common/tran';
import { Badge } from '@/components/ui/badge';

import { type ServerStatus } from '@/types/response/ServerDetail';

type Props = {
  status: ServerStatus;
};

export default function ServerStatus({ status }: Props) {
  function render() {
    if (status === 'UP') {
      return (
        <Badge variant="warning">
          <Tran text="server.stopped" asChild />
        </Badge>
      );
    }

    if (status === 'HOST') {
      return (
        <Badge variant="success">
          <Tran text="server.online" asChild />
        </Badge>
      );
    }

    return (
      <Badge variant="destructive">
        <Tran text="server.offline" asChild />
      </Badge>
    );
  }

  return <div>{render()}</div>;
}
