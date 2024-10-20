'use client';

import { FilterIcon } from 'lucide-react';
import React, { FormEvent, Fragment, useRef, useState } from 'react';

import ComboBox from '@/components/common/combo-box';
import InfinitePage from '@/components/common/infinite-page';
import LoadingSpinner from '@/components/common/loading-spinner';
import MessageList from '@/components/common/message-list';
import LogCard from '@/components/log/log-card';
import { MessageCard } from '@/components/messages/message-card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LogType } from '@/constant/enum';
import { useSocket } from '@/context/socket-context';
import useMessage from '@/hooks/use-message';
import useQueryState from '@/hooks/use-query-state';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/client';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { Log } from '@/types/response/Log';

import { getLogs, getLogCollections, getLogCount } from '@/query/log';
import { Hidden } from '@/components/common/hidden';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import GridPaginationList from '@/components/common/grid-pagination-list';
import PaginationNavigator from '@/components/common/pagination-navigator';
import useClientQuery from '@/hooks/use-client-query';
import { XIcon } from '@/components/common/icons';
import ScrollContainer from '@/components/common/scroll-container';

const defaultState = {
  collection: 'LIVE',
};

export default function LogPage() {
  const [{ collection }] = useQueryState(defaultState);

  return <div className="flex h-full w-full flex-col gap-2 overflow-hidden p-2">{collection === 'LIVE' ? <LiveLog /> : <StaticLog />}</div>;
}

function LiveLog() {
  const { state } = useSocket();
  const ref = useRef<HTMLDivElement>(null);
  const [{ collection }, setQueryState] = useQueryState(defaultState);

  const { data } = useClientQuery({
    queryKey: ['log-collections'],
    queryFn: async (axios) => getLogCollections(axios),
  });

  return (
    <Fragment>
      <ComboBox
        value={{ label: collection, value: collection }}
        values={['LIVE', ...(data ?? [])].map((item) => ({
          label: item,
          value: item,
        }))}
        onChange={(collection) => setQueryState({ collection })}
      />
      <div className="grid h-full w-full grid-rows-[1fr_3rem] gap-2 overflow-hidden">
        <div className="flex h-full w-full overflow-hidden rounded-md bg-card">
          <div className="flex h-full w-full overflow-hidden">
            {state !== 'connected' ? (
              <LoadingSpinner className="flex h-full w-full items-center justify-center" />
            ) : (
              <ScrollContainer ref={ref}>
                <MessageList className="flex h-full w-full flex-col gap-2" queryKey={['live-log']} room="LOG" container={() => ref.current} params={{ size: 50 }} showNotification={false}>
                  {(data) => <MessageCard key={data.id} message={data} />}
                </MessageList>
              </ScrollContainer>
            )}
          </div>
        </div>
        <SendMessageButton />
      </div>
    </Fragment>
  );
}
function SendMessageButton() {
  const [message, setMessage] = useState<string>('');
  const { state } = useSocket();

  const t = useI18n();

  const { sendMessage } = useMessage({
    room: 'LOG',
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    sendMessage(message);
    setMessage('');
    event.preventDefault();
  };

  return (
    <form className="flex h-10 flex-1 gap-2" name="text" onSubmit={handleFormSubmit}>
      <Input className="h-full w-full border border-border bg-background px-2 outline-none" value={message} onChange={(event) => setMessage(event.currentTarget.value)} />
      <Button className="h-full" variant="primary" type="submit" title={t('send')} disabled={state !== 'connected' || !message}>
        {t('send')}
      </Button>
    </form>
  );
}

type LogEnvironment = 'Prod' | 'Dev';

type Filter = {
  collection?: string;
  env?: LogEnvironment;
  ip?: string;
  userId?: string;
  url?: string;
  content?: string;
  before?: string;
  after?: string;
};

const defaultFilter: Filter = {
  collection: 'LIVE',
  env: 'Prod',
  ip: '',
  userId: '',
  url: '',
  content: '',
  before: '',
  after: '',
};

type LogPaginationQuery = PaginationQuery & {
  collection: LogType;
  env: LogEnvironment;
} & Filter;

function StaticLog() {
  const [filter, setFilter] = useQueryState(defaultFilter);
  const { size, page } = useSearchPageParams();

  const { env, ip, userId, url, content, before, after, collection } = filter;

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data: total } = useClientQuery({
    queryKey: ['log', 'total', collection, filter],
    queryFn: (axios) => getLogCount(axios, { ...filter, collection: collection as LogType }),
    placeholderData: 0,
  });

  const { data } = useClientQuery({
    queryKey: ['log-collections'],
    queryFn: async (axios) => getLogCollections(axios),
  });

  return (
    <div className="flex h-full w-full flex-col space-y-2 overflow-hidden">
      <div className="flex justify-between gap-2 rounded-md">
        <div className="flex items-center gap-2">
          <ComboBox
            value={{ label: collection, value: collection }}
            values={['LIVE', ...(data ?? [])].map((item) => ({
              label: item,
              value: item,
            }))}
            onChange={(collection) => setFilter({ collection })}
          />
          <ComboBox<'Prod' | 'Dev'>
            value={{ label: env, value: env as LogEnvironment }}
            values={[
              { value: 'Prod', label: 'Prod' },
              { value: 'Dev', label: 'Dev' },
            ]}
            onChange={(env) => setFilter({ env: env || 'Prod' })}
          />
          <FilterDialog filter={filter} setFilter={setFilter} />
        </div>
        <PaginationLayoutSwitcher />
      </div>
      <ListLayout>
        <div className="relative flex h-full flex-col gap-2 overflow-x-hidden" ref={(ref) => setContainer(ref)}>
          <InfinitePage<Log, LogPaginationQuery>
            className="flex w-full flex-col items-center justify-center gap-2"
            params={{
              page,
              size,
              collection: collection as LogType,
              env: env as LogEnvironment,
              content,
              userId,
              ip,
              url,
              before,
              after,
            }}
            container={() => container}
            queryKey={['logs']}
            getFunc={getLogs}
          >
            {(data) => <LogCard key={data.id} log={data} onClick={setFilter} />}
          </InfinitePage>
        </div>
      </ListLayout>
      <GridLayout>
        <GridPaginationList
          className="flex w-full flex-col items-center justify-center gap-2"
          params={{
            page,
            size,
            collection: collection as LogType,
            env: env as LogEnvironment,
            content,
            userId,
            ip,
            url,
            before,
            after,
          }}
          queryKey={['logs']}
          getFunc={getLogs}
        >
          {(data) => <LogCard key={data.id} log={data} onClick={setFilter} />}
        </GridPaginationList>
      </GridLayout>
      <div className="flex justify-end">
        <GridLayout>
          <PaginationNavigator numberOfItems={total} />
        </GridLayout>
      </div>
    </div>
  );
}

type FilterDialogProps = {
  filter: Filter;
  setFilter: (value: Record<string, string | undefined>) => void;
};

function FilterDialog({ filter, setFilter }: FilterDialogProps) {
  const { ip, userId, url, content, before, after } = filter;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="border-none bg-secondary shadow-md" variant="outline" title="Filter">
          <FilterIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="grid w-fit max-w-full gap-2 p-6">
        <Hidden>
          <DialogTitle />
          <DialogDescription />
        </Hidden>
        <div>
          <label>Content</label>
          <div className="flex gap-2">
            <Input placeholder="Content" value={content} onChange={(event) => setFilter({ content: event.currentTarget.value })} />
            <Button title="Remove" variant="outline" disabled={!content} onClick={() => setFilter({ content: '' })}>
              <XIcon />
            </Button>
          </div>
        </div>
        <div>
          <label>IP</label>
          <div className="flex gap-2">
            <Input placeholder="IP" value={ip} onChange={(event) => setFilter({ ip: event.currentTarget.value })} />
            <Button title="Remove" variant="outline" disabled={!ip} onClick={() => setFilter({ ip: '' })}>
              <XIcon />
            </Button>
          </div>
        </div>
        <div>
          <label>UserId</label>
          <div className="flex gap-2">
            <Input placeholder="User Id" value={userId} onChange={(event) => setFilter({ userId: event.currentTarget.value })} />
            <Button title="Remove" variant="outline" disabled={!userId} onClick={() => setFilter({ userId: '' })}>
              <XIcon />
            </Button>
          </div>
        </div>
        <div>
          <label>Request url</label>
          <div className="flex gap-2">
            <Input placeholder="Request url" value={url} onChange={(event) => setFilter({ url: event.currentTarget.value })} />
            <Button title="Remove" variant="outline" disabled={!url} onClick={() => setFilter({ url: '' })}>
              <XIcon />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="py-1">
            <label className="block">Before day</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button className={cn('w-[240px] pl-3 text-left font-normal', !before && 'text-muted-foreground')} title="Pick" variant="outline">
                  {before ? `${new Date(before).toLocaleDateString()}` : 'Pick a day'}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={before ? new Date(before) : undefined}
                  onSelect={(value) => setFilter({ before: value?.toISOString() ?? '' })}
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="py-1">
            <label className="block">After day</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button className={cn('w-[240px] pl-3 text-left font-normal', !after && 'text-muted-foreground')} title="Pick" variant="outline">
                  {after ? `${new Date(after).toLocaleDateString()}` : 'Pick a day'}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={after ? new Date(after) : undefined}
                  onSelect={(value) => setFilter({ after: value?.toISOString() ?? '' })}
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
