'use client';

import { Button } from '@/components/ui/button';
import React, { useCallback, useEffect, useState } from 'react';

let clientWebSocket: WebSocket;

export default function LogPage() {
  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  const addLog = (message: string) => {
    setLog((prev) => [...prev, message]);
  };

  const sendMessage = () => {
    if (clientWebSocket?.readyState === 1) {
      clientWebSocket?.send(message);
      setMessage('');
    }
  };

  const connect = useCallback(() => {
    clientWebSocket = new WebSocket('ws://localhost:8080/sockets/logs');

    clientWebSocket.onclose = function (error) {
      console.log('clientWebSocket.onclose', clientWebSocket, error);
    };
    clientWebSocket.onerror = function (error) {
      console.log('clientWebSocket.onerror', clientWebSocket, error);
    };
    clientWebSocket.onmessage = function (data) {
      addLog(data.data);
    };

    clientWebSocket.onclose = () => {
      setTimeout(function () {
        connect();
      }, 1000);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => clientWebSocket.close();
  }, [connect]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <section className="flex h-full w-full flex-col overflow-y-auto p-4">
        {log.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </section>
      <div className="bottom-0 flex w-full gap-2">
        <input
          className="w-full rounded-md border-2 border-border bg-background outline-none"
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
