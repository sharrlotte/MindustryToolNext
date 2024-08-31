import Tran from '@/components/common/tran';
import React, { Fragment } from 'react';

type Props = {
  alive: boolean;
  started: boolean;
};

export default function ServerStatus({ alive, started }: Props) {
  function render() {
    if (!alive) {
      return (
        <Fragment>
          <span className="size-2 rounded-full bg-destructive" />
          <Tran text="server.stopped" />
        </Fragment>
      );
    }

    if (started) {
      return (
        <Fragment>
          <span className="size-2 rounded-full bg-success" />
          <Tran text="server.online" />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <span className="size-2 rounded-full bg-warning" />
        <Tran text="server.offline" />
      </Fragment>
    );
  }

  return <div className="flex items-center gap-1">{render()}</div>;
}
