'use client';

import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { RefreshCwIcon } from 'lucide-react';
import { use, useMemo, useRef, useState } from 'react';
import React from 'react';
import { Line } from 'react-chartjs-2';

import ComboBox from '@/components/common/combo-box';
import ErrorMessage from '@/components/common/error-message';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useI18n } from '@/i18n/client';
import { metricFilters } from '@/lib/metric.utils';
import { fillMetric } from '@/lib/metric.utils';
import { cn } from '@/lib/utils';
import { getServerLoginMetrics } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Filter = (typeof metricFilters)[number];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const [filter, setFilter] = useState<Filter>(metricFilters[4]);

	return (
		<div className="p-2 flex flex-col gap-2">
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
			<Divider />
			<ScrollContainer className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
				<LoginLogChart serverId={id} filter={filter} />
			</ScrollContainer>
		</div>
	);
}

function RefreshButton() {
	const { invalidateByKey } = useQueriesData();

	const [isPlaying, setIsPlaying] = useState(false);

	const refresh = () => {
		setIsPlaying(true);

		invalidateByKey(['server', 'metric']);

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
		<div className="aspect-video h-auto w-full flex bg-card overflow-hidden rounded-lg">
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
