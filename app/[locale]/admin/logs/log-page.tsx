'use client';

import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

let socket: ReconnectingWebSocket;

type SocketState =
  | 'uninitiated'
  | 'initiating'
  | 'connecting'
  | 'connected'
  | 'disconnected';

export default function LogPage() {
  const { data: session } = useSession();

  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [state, setState] = useState<SocketState>('uninitiated');

  const accessToken = session?.user?.accessToken;

  const initSocket = useCallback(async () => {
    setState('initiating');

    if (!accessToken) {
      setState('uninitiated');
      return;
    }

    setState('connecting');

    socket = new ReconnectingWebSocket(
      `ws://localhost:8080/socket?accessToken=${accessToken}`,
    );

    socket.onopen = (event) => setState('connected');
    socket.close = (event) => setState('disconnected');
    socket.onerror = (err) => {
      console.log(err);
      setState('disconnected');
    };
    socket.onmessage = ({ data }) => addLog(JSON.parse(data));
  }, [accessToken]);

  useEffect(() => {
    initSocket();

    return () => socket?.close();
  }, [initSocket]);

  const addLog = (message: string[]) => {
    setLog((prev) => [...prev, ...message]);
  };

  const sendMessage = () => {
    if (socket && state === 'connected') {
      socket.send(message);
      setMessage('');
    } else if (state === 'uninitiated' || state === 'disconnected') {
      initSocket();
    }
  };

  return (
    <Fragment>
      <div className="flex h-full w-full flex-col">
        <div className="grid h-[calc(100%-5.5rem)] gap-2 overflow-auto p-2">
          {log.slice(log.length - 200).map((item, index) => (
            <p className="rounded-lg bg-zinc-900 p-2" key={index}>
              {item}
            </p>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 m-2 flex h-10 gap-2">
        <input
          className="h-full w-full rounded-md border border-border bg-background outline-none"
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <Button
          title="send"
          onClick={sendMessage}
          disabled={state !== 'connected'}
        >
          Send
        </Button>
      </div>
    </Fragment>
  );
}
