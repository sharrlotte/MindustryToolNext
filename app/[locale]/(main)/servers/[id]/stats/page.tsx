'use client';

import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { Suspense } from 'react';
import { Line } from 'react-chartjs-2';

import env from '@/constant/env';
import usePathId from '@/hooks/use-path-id';
import useSse from '@/hooks/use-sse';
import { useI18n } from '@/i18n/client';
import { ServerLiveStats } from '@/types/response/ServerLiveStats';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Page() {
	const id = usePathId();
	const data = useSse<ServerLiveStats>(`${env.url.api}/servers/${id}/live-stats`, {
		limit: 25,
	});

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 p-2">
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
					metrics={
						data?.map(({ createdAt, value }) => ({
							createdAt: new Date(createdAt),
							value: value.tps,
						})) ?? []
					}
				/>
			</Suspense>
			<Suspense>
				<LineChart
					label="player"
					metrics={
						data?.map(({ createdAt, value }) => ({
							createdAt: new Date(createdAt),
							value: value.players,
						})) ?? []
					}
				/>
			</Suspense>
			<Suspense>
				<LineChart
					label="kick"
					metrics={
						data?.map(({ createdAt, value }) => ({
							createdAt: new Date(createdAt),
							value: value.kicks,
						})) ?? []
					}
				/>
			</Suspense>
		</div>
	);
}

function LineChart({
	metrics,
	label,
	unit,
}: {
	label: string;
	unit?: string;
	metrics: {
		createdAt: Date;
		value: number;
	}[];
}) {
	const { t } = useI18n('metric');

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
					labels: metrics.map(({ createdAt }) => `${createdAt.getMinutes()}:${createdAt.getSeconds()}`),
					datasets: [
						{
							label: unit ? `${t(label)} (${unit})` : t(label),
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
