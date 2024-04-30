'use client';

import React, { FormEvent, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import useSocket from '@/hooks/use-socket';
import { useQuery } from '@tanstack/react-query';
import useClientAPI from '@/hooks/use-client';
import getLogCollections from '@/query/log/get-log-collections';
import ComboBox from '@/components/common/combo-box';
import getLogs from '@/query/log/get-logs';
import InfinitePage from '@/components/common/infinite-page';
import { LogCollection } from '@/constant/enum';
import LogCard from '@/components/log/log-card';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { Log } from '@/types/response/Log';
import useQueryState from '@/hooks/use-query-state';
import LoadingSpinner from '@/components/common/loading-spinner';

export default function LogPage() {
  const [collection, setCollection] = useQueryState('collection', 'LIVE');

  const { axios, enabled } = useClientAPI();

  const { data } = useQuery({
    queryKey: ['log-collections'],
    queryFn: async () => getLogCollections(axios),
    enabled,
  });

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden">
      <ComboBox
        value={{ label: collection, value: collection }}
        values={['LIVE', ...(data ?? [])].map((item) => ({
          label: item,
          value: item,
        }))}
        onChange={setCollection}
      />

      {collection && collection !== 'LIVE' ? (
        <StaticLog collection={collection} />
      ) : (
        <LiveLog />
      )}
    </div>
  );
}

function LiveLog() {
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
      socket.send({ method: 'JOIN_ROOM', data: 'LOG' });
      socket.onRoom('LOG').send({ method: 'LOAD' });

      socket.onRoom('LOG').onMessage('LOAD', (message) => addLog(message));
      socket.onRoom('LOG').onMessage('MESSAGE', (message) => addLog([message]));
    }
  }, [socket, state, isAuthenticated]);

  const sendMessage = () => {
    if (socket && state === 'connected') {
      setMessage('');
      socket.onRoom('LOG').send({ data: message, method: 'MESSAGE' });
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
        <div className="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden">
          {state !== 'connected' ? (
            <LoadingSpinner className="m-auto h-6 w-6 flex-1" />
          ) : (
            log.map((item, index) => (
              <div
                className="text-wrap rounded-lg bg-background p-2"
                key={index}
              >
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
          className="h-full w-full rounded-md border border-border bg-background px-2 outline-none"
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

type StaticLogProps = {
  collection: string;
};

type LogEnvironment = 'Prod' | 'Dev';

type LogPaginationQuery = PaginationQuery & {
  collection: LogCollection;
  env: LogEnvironment;
};

function StaticLog({ collection }: StaticLogProps) {
  const [env, setEnv] = useQueryState('environment', '');

  return (
    <>
      <ComboBox
        value={{ label: 'Prod', value: 'Prod' }}
        values={[
          { value: 'Prod', label: 'Prod' },
          { value: 'Dev', label: 'Dev' },
        ]}
        onChange={setEnv}
      />
      <div className="relative flex h-full flex-col gap-2 overflow-y-auto overflow-x-hidden">
        <InfinitePage<Log, LogPaginationQuery>
          className="flex w-full flex-col items-center justify-center gap-2"
          params={{
            page: 0,
            items: 20,
            collection: collection as LogCollection,
            env: env as LogEnvironment,
          }}
          queryKey={['logs']}
          getFunc={getLogs}
        >
          {(data) => <LogCard key={data.id} log={data} />}
        </InfinitePage>
      </div>
    </>
  );
}
