'use client';

import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

let socket: ReconnectingWebSocket;

type SocketState =
  | 'uninitiated'
  | 'initiating'
  | 'connecting'
  | 'connected'
  | 'disconnected';

export default function LogPage() {
  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const { data: session } = useSession();
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
    socket.onmessage = (event) => addLog(event.data);
  }, [accessToken]);

  useEffect(() => {
    initSocket();

    return () => socket?.close();
  }, [initSocket]);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, message]);
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
    <div className="flex h-full w-full flex-col justify-between">
      <section className="flex h-full w-screen flex-col overflow-y-auto p-4">
        {log.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </section>
      <div className="bottom-0 flex w-full gap-2">
        <input
          className="w-full rounded-md border border-border bg-background outline-none"
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
    </div>
  );
}
