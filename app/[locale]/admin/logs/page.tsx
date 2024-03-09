'use client';

import React, { FormEvent, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/common/loading-spinner';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import useSocket from '@/hooks/use-socket';

export default function LogPage() {
  const { socket, state } = useSocket();

  const [isLoaded, setLoaded] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const bottomRef = useRef<HTMLSpanElement | null>();

  const t = useI18n();

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
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (!isLoaded && socket && state === 'connected') {
      setLoaded(true);
      socket.send({ method: 'LOAD' });
    }
  }, [socket, isLoaded, state]);

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
      <div className="grid h-full w-full overflow-hidden rounded-md bg-card p-2">
        <div className="flex h-full flex-col gap-1 overflow-auto pr-2">
          {isLoaded ? (
            log.slice(log.length - 200).map((item, index) => (
              <span className="rounded-lg bg-background p-2" key={index}>
                {item}
              </span>
            ))
          ) : (
            <LoadingSpinner className="h-full w-full" />
          )}
          <span ref={(ref) => (bottomRef.current = ref)}></span>
        </div>
      </div>
      <form
        className="flex h-10 flex-1 gap-2"
        name="text"
        onSubmit={handleFormSubmit}
      >
        <input
          className="h-full w-full rounded-md border border-border bg-background px-2 outline-none"
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <Button
          className={cn({
            'h-full bg-button hover:bg-button': state === 'connected',
          })}
          type="submit"
          title={t('send')}
          disabled={state !== 'connected' || !message}
        >
          {t('send')}
        </Button>
      </form>
    </div>
  );
}
