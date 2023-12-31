'use client';

import { Button } from '@/components/ui/button';
import useSocket from '@/hooks/use-socket';
import { cn } from '@/lib/utils';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

export default function LogPage() {
  const { socket, state } = useSocket();

  const loaded = useRef(false);
  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const bottomRef = useRef<HTMLSpanElement | null>();

  const addLog = (message: string[]) => {
    setLog((prev) => [...prev, ...message]);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (socket) {
    socket.message = (message) => addLog(message);
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (!loaded.current && socket) {
      socket.send({ method: 'LOAD' });
      loaded.current = true;
    }
  }, [loaded, socket]);

  const sendMessage = () => {
    if (socket && state === 'connected') {
      setMessage('');
      socket.send({ data: message, method: 'MESSAGE' });
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    sendMessage();
    event.preventDefault();
  };

  return (
    <div className="grid h-full w-full grid-rows-[1fr_3rem] gap-2 overflow-hidden">
      <div className="grid h-full w-full overflow-hidden rounded-md bg-zinc-900 p-2">
        <div className="flex h-full flex-col gap-2 overflow-auto pr-2">
          {log.slice(log.length - 200).map((item, index) => (
            <span className="rounded-lg bg-zinc-700 p-2" key={index}>
              {item}
            </span>
          ))}
          <span ref={(ref) => (bottomRef.current = ref)}></span>
        </div>
      </div>
      <form className="flex h-10 flex-1 gap-2" onSubmit={handleFormSubmit}>
        <input
          className="h-full w-full rounded-md border border-border bg-background px-2 outline-none"
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <Button
          className={cn({
            'bg-emerald-500 hover:bg-emerald-500': state === 'connected',
          })}
          type="submit"
          title="send"
          disabled={state !== 'connected' || !message}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
