'use client';

import { Button } from '@/components/ui/button';
import React, { useCallback, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

let socket: Socket;

export default function LogPage() {
  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  const socketInitializer = useCallback(async () => {
    // Setup the Socket
    socket = io({ path: '/api/socket/ping' });

    // Standard socket management
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    socket.on('connect_error', (error) => {
      console.log('Connection error:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to the server. Attempt:', attemptNumber);
    });

    socket.on('reconnect_error', (error) => {
      console.log('Reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.log('Failed to reconnect to the server');
    });

    // Manage socket message events
    socket.on('client-new', (message) => {
      console.log('new client', message);
    });

    socket.on('message', (message) => {
      addLog(message);
    });

    socket.on('client-count', (count) => {
      console.log('clientCount', count);
    });
  }, []);

  useEffect(() => {
    socketInitializer();

    return () => {
      socket.disconnect();
    };
  }, [socketInitializer]);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, message]);
  };

  const sendMessage = () => {
    socket.send(message);
    setMessage('');
  };

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
