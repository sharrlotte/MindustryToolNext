'use client';

import { Button } from '@/components/ui/button';
import env from '@/constant/env';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

let socket: ReconnectingWebSocket;

export default function LogPage() {
  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const { data: session } = useSession();

  const accessToken = session?.user?.accessToken;

  const socketInitializer = useCallback(async (accessToken: string) => {
    socket = new ReconnectingWebSocket(
      `ws://localhost:8080/socket?accessToken=${accessToken}`,
    );

    socket.onmessage = (event) => addLog(event.data);

    socket.onerror = (err) => {
      console.error(err);
    };
  }, []);

  useEffect(() => {
    if (accessToken) {
      socketInitializer(accessToken);
    }

    return () => {
      if (socket) socket.close();
    };
  }, [socketInitializer, accessToken]);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, message]);
  };

  const sendMessage = () => {
    if (socket) {
      socket.send(message);
      setMessage('');
    } else {
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
        <Button title="send" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
}
