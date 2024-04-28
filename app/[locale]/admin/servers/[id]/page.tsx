'use client';

import LoadingSpinner from '@/components/common/loading-spinner';
import { Button } from '@/components/ui/button';
import useSearchId from '@/hooks/use-search-id-params';
import useSocket from '@/hooks/use-socket';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

export default function Page() {
  const { id } = useSearchId();

  const { socket, state, isAuthenticated } = useSocket();

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

  useEffect(() => {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (socket && state === 'connected' && isAuthenticated) {
      socket.send({ method: 'JOIN_ROOM', data: `SERVER-${id}` });
      socket.onRoom(`SERVER-${id}`).send({ method: 'LOAD' });

      socket
        .onRoom(`SERVER-${id}`)
        .onMessage('LOAD', (message) => addLog(message));

      socket
        .onRoom(`SERVER-${id}`)
        .onMessage('SERVER_MESSAGE', (message) => addLog([message]));
    }
  }, [socket, state, isAuthenticated]);

  const sendMessage = () => {
    if (socket && state === 'connected') {
      setMessage('');
      socket
        .onRoom(`SERVER-${id}`)
        .send({ data: message, method: 'SERVER_MESSAGE' });

      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    sendMessage();
    event.preventDefault();
  };

  return (
    <div className="grid h-full w-full grid-rows-[1fr_3rem] gap-2 overflow-hidden bg-card px-2 pt-2">
      <div className="grid h-full w-full overflow-hidden">
        <div className="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden bg-background pr-2">
          {state !== 'connected' ? (
            <LoadingSpinner className="m-auto h-6 w-6 flex-1" />
          ) : (
            log.map((item, index) => (
              <div className="text-wrap p-2" key={index}>
                {item}
              </div>
            ))
          )}
          <span ref={(ref) => (bottomRef.current = ref)}></span>
        </div>
      </div>
      <form
        className="flex h-10 flex-1 gap-1"
        name="text"
        onSubmit={handleFormSubmit}
      >
        <input
          className="h-full w-full rounded-sm border border-border bg-background px-2 outline-none"
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <Button
          className={cn('h-full', {
            'bg-button hover:bg-button': state === 'connected',
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
