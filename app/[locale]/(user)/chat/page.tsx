'use client';

import React, { FormEvent, useEffect, useRef, useState } from 'react';

import LoginButton from '@/components/button/login-button';
import InfiniteScrollList from '@/components/common/infinite-scroll-list';
import LoadingSpinner from '@/components/common/loading-spinner';
import { Button } from '@/components/ui/button';
import { useSession } from '@/context/session-context';
import { useSocket } from '@/context/socket-context';
import ProtectedElement from '@/layout/protected-element';
import { isReachedEnd } from '@/lib/utils';
import { useI18n } from '@/locales/client';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';

export default function LogPage() {
  const { socket, state } = useSocket();
  const { session } = useSession();
  const container = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState<string>('');
  const bottomRef = useRef<HTMLSpanElement>(null);
  const queryClient = useQueryClient();

  const t = useI18n();

  useEffect(() => {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000);
  }, []);

  useEffect(() => {
    socket.onRoom('GLOBAL').send({ method: 'JOIN_ROOM', data: 'GLOBAL' });
    socket.onRoom('GLOBAL').onMessage('MESSAGE', (message) => {
      queryClient.setQueryData<
        InfiniteData<Array<string>, unknown> | undefined
      >(['live-log'], (query) => {
        if (!query) {
          return undefined;
        }

        const { pages, ...data } = query;

        let [firstPage, ...rest] = pages;
        firstPage = [message, ...firstPage];
        return {
          ...data,
          pages: [firstPage, ...rest],
        };
      });

      setTimeout(() => {
        if (!bottomRef.current || !container.current) {
          return;
        }

        if (!isReachedEnd(container.current)) {
          return;
        }

        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
  }, [queryClient, socket]);

  const sendMessage = async () => {
    if (socket && state === 'connected') {
      socket.onRoom('GLOBAL').send({ data: message, method: 'MESSAGE' });
      setMessage('');
    }

    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    sendMessage();
    event.preventDefault();
  };

  return (
    <div className="grid h-full w-full grid-rows-[1fr_3rem] gap-2 overflow-hidden p-2">
      <div className="grid h-full w-full overflow-hidden rounded-md bg-card p-2">
        <div className="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden">
          {state !== 'connected' ? (
            <LoadingSpinner className="m-auto h-5 w-5 flex-1" />
          ) : (
            <div className="h-full overflow-y-auto" ref={container}>
              <InfiniteScrollList
                className="flex flex-col gap-1 overflow-hidden h-full"
                queryKey={['live-log']}
                reversed
                container={() => container.current}
                params={{ page: 0, items: 40 }}
                end={<></>}
                noResult={''}
                getFunc={(
                  _,
                  params: {
                    page: number;
                    items: number;
                  },
                ) =>
                  socket
                    .onRoom('GLOBAL')
                    .await({ method: 'GET_MESSAGE', ...params })
                }
              >
                {(data, index) => (
                  <span
                    className="w-full text-wrap rounded-lg bg-background p-2"
                    key={index}
                  >
                    {data}
                  </span>
                )}
              </InfiniteScrollList>
              <span ref={bottomRef}></span>
            </div>
          )}
        </div>
      </div>
      <ProtectedElement
        session={session}
        all={['USER']}
        alt={
          <div className="h-full w-full text-center whitespace-nowrap">
            <LoginButton className="justify-center bg-button">
              Login to chat
            </LoginButton>
          </div>
        }
      >
        <form
          className="flex h-10 flex-1 gap-1"
          name="text"
          onSubmit={handleFormSubmit}
        >
          <input
            className="h-full w-full rounded-md border border-border bg-background px-2 outline-none"
            value={message}
            onChange={(event) => setMessage(event.currentTarget.value)}
          />
          <Button
            className="h-full"
            variant="primary"
            type="submit"
            title={t('send')}
            disabled={state !== 'connected' || !message}
          >
            {t('send')}
          </Button>
        </form>
      </ProtectedElement>
    </div>
  );
}
