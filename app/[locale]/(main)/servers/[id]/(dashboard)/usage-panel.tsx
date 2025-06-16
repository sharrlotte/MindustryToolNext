'use client';

import { useMemo } from 'react';

import Tran from '@/components/common/tran';
import RamUsageChart from '@/components/metric/ram-usage-chart';
import CpuProgress from '@/components/server/cpu-progress';

import env from '@/constant/env';
import useSse from '@/hooks/use-sse';
import { byteToSize } from '@/lib/utils';
import { ServerLiveStats } from '@/types/response/ServerLiveStats';
import { ServerPlan } from '@/types/response/ServerPlan';

type UsagePanelProps = {
	id: string;
	cpuUsage: number;
	ramUsage: number;
	jvmRamUsage: number;
	totalRam: number;
	plan: ServerPlan;
};

export default function UsagePanel({ id, cpuUsage, jvmRamUsage, ramUsage, totalRam, plan }: UsagePanelProps) {
	const { data } = useSse<ServerLiveStats>(`${env.url.api}/servers/${id}/live-stats`, {
		limit: 1,
	});

	const { cpu, serverRam, jvmRam } = useMemo(
		() => ({
			cpu: (Math.round(data[0]?.value.cpuUsage ?? cpuUsage) * 100) / 100,
			serverRam: (data[0]?.value.ramUsage ?? ramUsage) * 1024 * 1024,
			jvmRam: (data[0]?.value.jvmRamUsage ?? jvmRamUsage) * 1024 * 1024,
		}),
		[cpuUsage, jvmRamUsage, ramUsage, data],
	);

	const nativeRam = jvmRam - serverRam;

	return (
		<div className="flex flex-col w-full text-sm max-w-[400px] gap-2">
			<div className="flex gap-2 justify-between w-full">
				<Tran className="font-bold" text="server.cpu-usage" />
				<span className="text-muted-foreground">{cpu}%</span>
			</div>
			<CpuProgress value={cpu} maxValue={plan.cpu * 100} />
			<div className="flex gap-2 justify-between w-full">
				<Tran className="font-bold" text="metric.ram-usage" />
				<span className="text-muted-foreground">
					{`${byteToSize(serverRam)} + ${byteToSize(nativeRam)} (server + native)`} / {byteToSize(totalRam * 1024 * 1024)}
				</span>
			</div>
			<RamUsageChart serverRamUsage={serverRam} nativeRamUsage={nativeRam} totalRam={totalRam * 1024 * 1024} />
		</div>
	);
}
