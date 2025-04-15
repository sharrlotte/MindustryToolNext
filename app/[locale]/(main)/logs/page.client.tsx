'use client';

import React, { FormEvent, useCallback, useRef, useState } from 'react';

import ComboBox from '@/components/common/combo-box';
import GridPaginationList from '@/components/common/grid-pagination-list';
import { Hidden } from '@/components/common/hidden';
import { IconNotification } from '@/components/common/icon-notification';
import { FilterIcon, XIcon } from '@/components/common/icons';
import InfinitePage from '@/components/common/infinite-page';
import MessageList from '@/components/common/message-list';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import LogCard from '@/components/log/log-card';
import { MessageCard } from '@/components/messages/message-card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

import { LogType } from '@/constant/constant';
import { useSocket } from '@/context/socket.context';
import useClientQuery from '@/hooks/use-client-query';
import useMessage from '@/hooks/use-message';
import { cn } from '@/lib/utils';
import { getLogCollections, getLogCount, getLogs } from '@/query/log';
import { Log } from '@/types/Log';
import { LogEnvironment, LogPaginationQuerySchema, LogPaginationQueryType } from '@/types/schema/search-query';

export default function LogPage() {
	return (
		<ServerTabs className="p-2 h-full" value="live" name={'tab'} values={['live', 'static']}>
			<ServerTabsList className="justify-start">
				<ServerTabsTrigger value="live">
					<Tran text="log.live" />
				</ServerTabsTrigger>
				<ServerTabsTrigger value="static">
					<Tran text="log.static" />
				</ServerTabsTrigger>
			</ServerTabsList>
			<ServerTabsContent className="h-full" value="live">
				<LiveLog />
			</ServerTabsContent>
			<ServerTabsContent className="h-full" value="static">
				<StaticLog />
			</ServerTabsContent>
		</ServerTabs>
	);
}

function LiveLog() {
	return (
		<div className="grid h-full w-full grid-rows-[1fr_3rem] gap-2 overflow-hidden">
			<div className="flex h-full w-full overflow-hidden rounded-md bg-card">
				<div className="flex h-full w-full overflow-hidden">
					<MessageList className="flex h-full w-full flex-col gap-2" queryKey={['live-log']} room="LOG" params={{ size: 50 }} showNotification={false}>
						{(data) => <MessageCard key={data.id} message={data} />}
					</MessageList>
				</div>
			</div>
			<SendMessageButton />
		</div>
	);
}
function SendMessageButton() {
	const [message, setMessage] = useState<string>('');
	const { state } = useSocket();

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
			<Button className="h-full" variant="primary" type="submit" title="send" disabled={state !== 'connected' || !message}>
				<Tran text="send" />
			</Button>
		</form>
	);
}

const defaultFilter: Omit<LogPaginationQueryType, 'page' | 'size'> = {
	collection: 'SERVER',
	env: 'Prod',
	ip: '',
	userId: '',
	url: '',
	content: '',
	before: '',
	after: '',
};

function StaticLog() {
	const [filter, _setFilter] = useState<Omit<LogPaginationQueryType, 'page' | 'size'>>(defaultFilter);
	const { env, ip, userId, url, content, before, after, collection } = filter;

	const container = useRef<HTMLDivElement | null>(null);

	const setFilter = useCallback((value: Partial<Omit<LogPaginationQueryType, 'page' | 'size'>>) => _setFilter((prev) => ({ ...prev, ...value })), []);

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
						values={[...(data ?? [])].map((item) => ({
							label: item,
							value: item,
						}))}
						onChange={(collection) => setFilter({ collection: collection ?? 'SERVER' })}
					/>
					<ComboBox<'Prod' | 'Dev'>
						value={{ label: env, value: env as LogEnvironment }}
						values={[
							{ value: 'Prod', label: 'Prod' },
							{ value: 'Dev', label: 'Dev' },
						]}
						onChange={(env) => setFilter({ env: env || 'Prod' })}
					/>
					<FilterDialog filter={filter} setFilter={(value) => setFilter(value)} />
				</div>
				<PaginationLayoutSwitcher />
			</div>
			<ScrollContainer className="relative flex h-full flex-col gap-2" ref={container}>
				<ListLayout>
					<InfinitePage<Log, typeof LogPaginationQuerySchema>
						className="flex w-full flex-col items-center justify-center gap-2"
						paramSchema={LogPaginationQuerySchema}
						params={{
							env: env as LogEnvironment,
							collection: (collection === 'LIVE' ? 'SYSTEM' : collection) as LogType,
							content,
							userId,
							ip,
							url,
							before,
							after,
						}}
						queryKey={['logs']}
						queryFn={getLogs}
					>
						{(data) => <LogCard key={data.id} log={data} onClick={setFilter} />}
					</InfinitePage>
				</ListLayout>
				<GridLayout>
					<GridPaginationList<Log, typeof LogPaginationQuerySchema>
						className="flex w-full flex-col items-center justify-center gap-2"
						paramSchema={LogPaginationQuerySchema}
						params={{
							collection: (collection === 'LIVE' ? 'SYSTEM' : collection) as LogType,
							env: env as LogEnvironment,
							content,
							userId,
							ip,
							url,
							before,
							after,
						}}
						queryKey={['logs']}
						queryFn={getLogs}
					>
						{(data) => <LogCard key={data.id} log={data} onClick={setFilter} />}
					</GridPaginationList>
				</GridLayout>
			</ScrollContainer>
			<div className="flex justify-end">
				<GridLayout>
					<PaginationNavigator numberOfItems={total} />
				</GridLayout>
			</div>
		</div>
	);
}

type FilterDialogProps = {
	filter: Omit<LogPaginationQueryType, 'size' | 'page'>;
	setFilter: (value: Record<string, string | undefined>) => void;
};

function FilterDialog({ filter, setFilter }: FilterDialogProps) {
	const { ip, userId, url, content, before, after } = filter;

	const number = [ip, userId, url, content, before, after].filter(Boolean).length;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="border-transparent bg-secondary shadow-md" variant="outline" title="Filter">
					<IconNotification number={number}>
						<FilterIcon />
					</IconNotification>
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
