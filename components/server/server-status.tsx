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
          <Tran text="server.stopped" />
          <span className="size-2 rounded-full bg-destructive" />
        </Fragment>
      );
    }

    if (started) {
      return (
        <Fragment>
          <Tran text="server.online" />
          <span className="size-2 rounded-full bg-success" />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Tran text="server.offline" />
        <span className="size-2 rounded-full bg-warning" />
      </Fragment>
    );
  }

  return <div className="flex items-center gap-1">{render()}</div>;
}
