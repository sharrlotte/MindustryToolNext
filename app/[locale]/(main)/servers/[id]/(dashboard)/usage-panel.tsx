'use client';

import { useMemo } from 'react';

import Tran from '@/components/common/tran';
import RamUsageChart from '@/components/metric/ram-usage-chart';
import CpuProgress from '@/components/server/cpu-progress';

import env from '@/constant/env';
import useSse from '@/hooks/use-sse';
import { byteToSize } from '@/lib/utils';
import { ServerLiveStats } from '@/types/response/ServerLiveStats';

type UsagePanelProps = {
	id: string;
	cpuUsage: number;
	ramUsage: number;
	totalRam: number;
};

export default function UsagePanel({ id, cpuUsage, ramUsage, totalRam }: UsagePanelProps) {
	const { data } = useSse<ServerLiveStats>(`${env.url.api}/servers/${id}/live-stats`, {
		limit: 1,
	});

	const { cpu, ram } = useMemo(
		() => ({
			cpu: (Math.round(data[0]?.value.cpuUsage ?? cpuUsage) * 100) / 100,
			ram: (data[0]?.value.ramUsage ?? ramUsage) * 1024 * 1024,
		}),
		[cpuUsage, data, ramUsage],
	);

	return (
		<div className="flex flex-col w-full text-sm max-w-[300px] gap-2">
			<div className="flex gap-2 justify-between w-full">
				<Tran className="font-bold" text="server.cpu-usage" />
				<span className="text-muted-foreground">{cpu}%</span>
			</div>
			<CpuProgress value={cpu} />
			<div className="flex gap-2 justify-between w-full">
				<Tran className="font-bold" text="metric.ram-usage" />
				<span className="text-muted-foreground">
					{byteToSize(ram)} / {byteToSize(totalRam * 1024 * 1024)}
				</span>
			</div>
			<RamUsageChart ramUsage={ram} totalRam={totalRam * 1024 * 1024} />
		</div>
	);
}
