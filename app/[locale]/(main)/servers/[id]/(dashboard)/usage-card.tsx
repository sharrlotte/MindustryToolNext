'use client';

import dynamic from 'next/dynamic';

import Tran from '@/components/common/tran';
import { Skeleton } from '@/components/ui/skeleton';

import useServerStats from '@/hooks/useServerStats';

type UsageCardProps = {
	id: string;
};

const RamUsageChart = dynamic(() => import('@/components/metric/ram-usage-chart'));

export default function UsageCard({ id }: UsageCardProps) {
	const { data, isLoading } = useServerStats(id);

	if (isLoading || !data) {
		return <Skeleton className="flex h-full w-full" />;
	}

	const { cpuUsage, ramUsage, totalRam } = data;

	return (
		<div className="h-full w-full flex flex-col">
			<div className="space-x-1">
				<Tran text="server.cpu-usage" />
				<span>{cpuUsage}%</span>
			</div>
			<RamUsageChart ramUsage={ramUsage * 1024 * 1024} totalRam={totalRam * 1024 * 1024} />
		</div>
	);
}
