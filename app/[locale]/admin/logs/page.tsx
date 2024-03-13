'use client';

import React, { FormEvent, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/common/loading-spinner';
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

export default function LogPage() {
  const [collection, setCollection] = useState<string>();

  const { axios, enabled } = useClientAPI();
  const { data } = useQuery({
    queryKey: ['log-types'],
    initialData: [],
    queryFn: () => getLogCollections(axios),
    enabled,
  });

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden">
      <ComboBox
        defaultValue={{ label: 'LIVE', value: 'LIVE' }}
        values={['LIVE', ...data].map((item) => ({
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
        className="flex h-10 flex-1 gap-1"
        name="text"
        onSubmit={handleFormSubmit}
      >
        <input
          className="h-10 w-full rounded-md border border-border bg-background px-2 outline-none"
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <Button
          className={cn({
            'h-10 bg-button hover:bg-button': state === 'connected',
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

function StaticLog({ collection }: StaticLogProps) {
  const scrollContainer = useRef<HTMLDivElement | null>();
  const [env, setEnv] = useState<'Prod' | 'Dev' | undefined>(undefined);
  return (
    <div
      className="relative flex h-full flex-col gap-2 overflow-y-auto overflow-x-hidden pr-2"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <ComboBox
        defaultValue={{ label: 'Prod', value: 'Prod' }}
        values={[
          { value: 'Prod', label: 'Prod' },
          { value: 'Dev', label: 'Dev' },
        ]}
        onChange={setEnv}
      />
      <InfinitePage
        className="flex w-full flex-col items-center justify-center gap-2"
        params={{ page: 0, collection: collection as LogCollection, env }}
        queryKey={['logs']}
        getFunc={getLogs}
        scrollContainer={scrollContainer.current}
      >
        {(data) => <LogCard key={data.id} log={data} />}
      </InfinitePage>
    </div>
  );
}
