'use client';

import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { RefreshCwIcon } from 'lucide-react';
import { Suspense } from 'react';
import { use, useMemo, useRef, useState } from 'react';
import React from 'react';
import { Line } from 'react-chartjs-2';



import ComboBox from '@/components/common/combo-box';
import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';



import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useSse from '@/hooks/use-sse';
import { useI18n } from '@/i18n/client';
import { metricFilters } from '@/lib/metric.utils';
import { fillMetric } from '@/lib/metric.utils';
import { cn } from '@/lib/utils';
import { getServerLoginMetrics } from '@/query/server';
import { ServerLiveStats } from '@/types/response/ServerLiveStats';



import { useQuery } from '@tanstack/react-query';


type Filter = (typeof metricFilters)[number];

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

export default function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const { data, state } = useSse<ServerLiveStats>(`${env.url.api}/servers/${id}/live-stats`, {
		limit: 15,
	});

	const [filter, setFilter] = useState<Filter>(metricFilters[4]);

	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-between items-center p-2">
				<div className="flex gap-0.5 h-8 min-h-8 items-center text-muted-foreground text-sm font-semibold">
					{state === 'disconnected' && <XCircleIcon className="m-0 size-4" />}
					{state === 'connecting' && <LoadingSpinner className="m-0 size-4" />}
					{state === 'connected' && <CheckCircleIcon className="m-0 size-4" />}
					<Tran text={state} defaultValue={state} />
				</div>
				<div className="flex justify-end gap-1">
					<ComboBox
						required
						searchBar={false}
						value={{
							value: filter,
							label: `${filter.interval}-${filter.unit}`,
						}}
						values={metricFilters.map(({ interval, unit }) => ({
							value: { interval, unit },
							label: `${interval}-${unit}`,
						}))}
						onChange={setFilter}
					/>
					<RefreshButton />
				</div>
			</div>
			<Divider />
			<ScrollContainer className="p-2 flex flex-col gap-2">
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
					<Suspense>
						<LineChart
							label="cpu"
							unit="%"
							metrics={
								data?.map(({ createdAt, value }) => ({
									createdAt: new Date(createdAt),
									value: value.cpuUsage,
								})) ?? []
							}
						/>
					</Suspense>
					<Suspense>
						<LineChart
							label="ram"
							unit="Mb"
							fill
							metrics={
								data?.map(({ createdAt, value }) => ({
									createdAt: new Date(createdAt),
									value: value.ramUsage,
								})) ?? []
							}
						/>
					</Suspense>
					<Suspense>
						<LineChart
							label="tps"
							unit="Tick per second"
							maxTick={60}
							metrics={
								data?.map(({ createdAt, value }) => ({
									createdAt: new Date(createdAt),
									value: value.tps,
								})) ?? []
							}
						/>
					</Suspense>
					<Suspense>
						<LoginLogChart serverId={id} filter={filter} />
					</Suspense>
				</div>
			</ScrollContainer>
		</div>
	);
}

function LineChart({
	metrics,
	label,
	unit,
	maxTick,
	fill = false,
	borderColor = 'rgb(255, 99, 132)',
	backgroundColor = 'rgba(255, 99, 132, 0.2)',
}: {
	label: string;
	unit?: string;
	fill?: boolean;
	borderColor?: string;
	backgroundColor?: string;
	maxTick?: number;
	metrics: {
		createdAt: Date;
		value: number;
	}[];
}) {
	const { t } = useI18n('metric');
	const avg = Math.round((100 * metrics.reduce((acc, { value }) => acc + value, 0)) / metrics.length) / 100;
	const min = metrics.reduce((acc, { value }) => Math.min(acc, value), Infinity);
	const max = metrics.reduce((acc, { value }) => Math.max(acc, value), -Infinity);

	const unitLabel = unit ? `(${unit})` : '';

	return (
		<div className="aspect-video h-auto w-full flex overflow-hidden rounded-lg border bg-card">
			<Line
				className="p-2"
				options={{
					animations: {
						y: {
							duration: 0,
						},
					},
					responsive: true,
					aspectRatio: 16 / 9,
					scales: {
						x: {
							ticks: {
								maxTicksLimit: 15,
							},
						},
						y: {
							max: maxTick,
							beginAtZero: true,
							ticks: {
								precision: 0,
							},
						},
					},
				}}
				data={{
					labels: metrics.map(
						({ createdAt }) =>
							`${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`,
					),
					datasets: [
						{
							label: `${t(label)} ${unitLabel} avg: ${avg} ${unitLabel} min: ${min} ${unitLabel} max: ${max} ${unitLabel}`,
							data: metrics.map(({ value }) => value),
							fill,
							borderColor,
							backgroundColor,
						},
					],
				}}
			/>
		</div>
	);
}

function RefreshButton() {
	const { invalidateByKey } = useQueriesData();

	const [isPlaying, setIsPlaying] = useState(false);

	const refresh = () => {
		setIsPlaying(true);

		invalidateByKey(['metric']);

		setTimeout(() => {
			setIsPlaying(false);
		}, 1000);
	};

	return (
		<Button variant="secondary" onClick={refresh}>
			<RefreshCwIcon className={cn('size-4', isPlaying && 'animate-spin')} />
			<Tran text="refresh" />
		</Button>
	);
}

function LoginLogChart({ serverId, filter }: { serverId: string; filter: Filter }) {
	const axios = useClientApi();
	const start = useRef(new Date());
	const { unit, interval } = filter;
	const { t } = useI18n('metric');

	const { data, isError, error } = useQuery({
		queryKey: ['server', serverId, 'metric', 'login', filter],
		queryFn: () => getServerLoginMetrics(axios, serverId, { ...filter, start: start.current }),
	});

	const metrics = useMemo(() => fillMetric(start.current, unit, interval, data, 0), [data, interval, start, unit]);

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return (
		<div className="aspect-video h-auto w-full flex bg-card overflow-hidden rounded-lg border">
			<Line
				className="p-2"
				options={{
					responsive: true,
					aspectRatio: 16 / 9,
					scales: {
						x: {
							ticks: {
								maxTicksLimit: 15,
							},
						},
						y: {
							beginAtZero: true,
							ticks: {
								precision: 0,
							},
						},
					},
				}}
				data={{
					labels: metrics.map(({ createdAt }) =>
						unit === 'DAY'
							? `${createdAt.getDate()}/${createdAt.getMonth() + 1}`
							: unit === 'HOUR'
								? `${createdAt.getHours()}:00`
								: `${createdAt.getHours()}:${createdAt.getMinutes()}`,
					),
					datasets: [
						{
							label: t('login'),
							data: metrics.map(({ value }) => value),
							borderColor: 'rgb(255, 99, 132)',
							backgroundColor: 'rgba(255, 99, 132, 0.5)',
						},
					],
				}}
			/>
		</div>
	);
}
