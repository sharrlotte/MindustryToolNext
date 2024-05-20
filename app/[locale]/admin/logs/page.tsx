'use client';

import React, { FormEvent, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
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
import { cn, isReachedEnd, mapReversed } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FilterIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function LogPage() {
  const [collection, setCollection] = useQueryState('collection', 'LIVE');

  const { axios, enabled } = useClientAPI();

  const { data } = useQuery({
    queryKey: ['log-collections'],
    queryFn: async () => getLogCollections(axios),
    enabled,
  });

  return (
    <div className="flex h-full w-full flex-col gap-1 overflow-hidden p-4">
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
  const containerRef = useRef<HTMLDivElement | null>();
  const bottomRef = useRef<HTMLSpanElement | null>();

  const t = useI18n();

  const addLog = (message: string[]) => {
    setLog((prev) => [...message, ...prev]);

    setTimeout(() => {
      if (!bottomRef.current || !containerRef.current) {
        return;
      }

      if (!isReachedEnd(containerRef.current)) {
        return;
      }

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
      socket.onRoom('LOG').send({ method: 'GET_MESSAGE', page: 0, items: 20 });

      socket
        .onRoom('LOG')
        .onMessage('GET_MESSAGE', (message) => addLog(message));

      socket.onRoom('LOG').onMessage('MESSAGE', (message) => addLog([message]));
    }
  }, [socket, state, isAuthenticated]);

  const sendMessage = () => {
    if (socket && state === 'connected') {
      setMessage('');
      socket.onRoom('LOG').send({ data: message, method: 'MESSAGE' });
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    sendMessage();
    event.preventDefault();
  };

  return (
    <div className="grid h-full w-full grid-rows-[1fr_3rem] gap-2 overflow-hidden">
      <div className="grid h-full w-full overflow-hidden rounded-md bg-card p-2">
        <div
          className="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden"
          ref={(ref) => {
            containerRef.current = ref;
          }}
        >
          {state !== 'connected' ? (
            <LoadingSpinner className="m-auto h-6 w-6 flex-1" />
          ) : (
            mapReversed(log, (item, index) => (
              <div
                className="text-wrap rounded-lg bg-background p-2"
                key={index}
              >
                {item}
              </div>
            ))
          )}
          <span
            ref={(ref) => {
              bottomRef.current = ref;
            }}
          ></span>
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
          className="h-full"
          variant="primary"
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

type Filter = {
  ip?: string;
  userId?: string;
  url?: string;
  content?: string;
  before?: string;
  after?: string;
};

type LogPaginationQuery = PaginationQuery & {
  collection: LogCollection;
  env: LogEnvironment;
} & Filter;

function StaticLog({ collection }: StaticLogProps) {
  const [env, setEnv] = useQueryState<LogEnvironment>('environment', 'Prod');
  const [content, setContent] = useQueryState('content', '');
  const [ip, setIp] = useQueryState('ip', '');
  const [url, setUrl] = useQueryState('url', '');
  const [userId, setUserId] = useQueryState('userId', '');
  const [before, setBefore] = useQueryState('before', '');
  const [after, setAfter] = useQueryState('after', '');
  const container = useRef<HTMLDivElement>(null);

  function setFilter({ ip, userId, url, content }: Filter) {
    if (content) {
      setContent(content);
    }

    if (userId) {
      setUserId(userId);
    }

    if (ip) {
      setIp(ip);
    }

    if (url) {
      setUrl(url);
    }
  }

  return (
    <div className="flex h-full w-full flex-col space-y-2 overflow-hidden">
      <div className="flex gap-1">
        <ComboBox
          value={{ label: env, value: env }}
          values={[
            { value: 'Prod', label: 'Prod' },
            { value: 'Dev', label: 'Dev' },
          ]}
          onChange={setEnv}
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button title="Filter">
              <FilterIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="grid gap-2">
            <div>
              <label>Content</label>
              <div className="flex gap-1">
                <Input
                  placeholder="Content"
                  value={content}
                  onChange={(event) => setContent(event.currentTarget.value)}
                />
                <Button
                  title="Remove"
                  variant="outline"
                  disabled={!content}
                  onClick={() => setContent('')}
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <label>IP</label>
              <div className="flex gap-1">
                <Input
                  placeholder="IP"
                  value={ip}
                  onChange={(event) => setIp(event.currentTarget.value)}
                />
                <Button
                  title="Remove"
                  variant="outline"
                  disabled={!ip}
                  onClick={() => setIp('')}
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <label>UserId</label>
              <div className="flex gap-1">
                <Input
                  placeholder="User Id"
                  value={userId}
                  onChange={(event) => setUserId(event.currentTarget.value)}
                />
                <Button
                  title="Remove"
                  variant="outline"
                  disabled={!userId}
                  onClick={() => setUserId('')}
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <label>Request url</label>
              <div className="flex gap-1">
                <Input
                  placeholder="Request url"
                  value={url}
                  onChange={(event) => setUrl(event.currentTarget.value)}
                />
                <Button
                  title="Remove"
                  variant="outline"
                  disabled={!url}
                  onClick={() => setUrl('')}
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <div className="py-1">
                <label className="block">Before day</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !before && 'text-muted-foreground',
                      )}
                      title="Pick"
                      variant="outline"
                    >
                      {before
                        ? `${new Date(before).toLocaleDateString()}`
                        : 'Pick a day'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={before ? new Date(before) : undefined}
                      onSelect={(value) =>
                        setBefore(value?.toISOString() ?? '')
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="py-1">
                <label className="block">After day</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !after && 'text-muted-foreground',
                      )}
                      title="Pick"
                      variant="outline"
                    >
                      {after
                        ? `${new Date(after).toLocaleDateString()}`
                        : 'Pick a day'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={after ? new Date(after) : undefined}
                      onSelect={(value) => setAfter(value?.toISOString() ?? '')}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div
        className="relative flex h-full flex-col gap-2 overflow-y-auto overflow-x-hidden"
        ref={container}
      >
        <InfinitePage<Log, LogPaginationQuery>
          className="flex w-full flex-col items-center justify-center gap-2"
          params={{
            page: 0,
            items: 20,
            collection: collection as LogCollection,
            env: env as LogEnvironment,
            content,
            userId,
            ip,
            url,
            before,
            after,
          }}
          container={() => container.current}
          queryKey={['logs']}
          getFunc={getLogs}
        >
          {(data) => <LogCard key={data.id} log={data} onClick={setFilter} />}
        </InfinitePage>
      </div>
    </div>
  );
}
