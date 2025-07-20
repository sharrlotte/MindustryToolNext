'use client';

import Tran from '@/components/common/tran';
import RamUsageChart from '@/components/metric/ram-usage-chart';
import CpuProgress from '@/components/server/cpu-progress';

import { ServerLiveStats } from '@/types/response/ServerLiveStats';
import { ServerPlan } from '@/types/response/ServerPlan';

import useSse from '@/hooks/use-sse';

import env from '@/constant/env';
import { byteToSize } from '@/lib/utils';

type UsagePanelProps = {
	id: string;
	cpuUsage: number;
	ramUsage: number;
	jvmRamUsage: number;
	plan: ServerPlan;
};

export default function UsagePanel({ id, cpuUsage, jvmRamUsage, ramUsage, plan }: UsagePanelProps) {
	const { data } = useSse<ServerLiveStats>(`${env.url.api}/servers/${id}/live-stats`, {
		limit: 1,
	});

	const cpu = (Math.ceil(data[data.length - 1]?.value.cpuUsage ?? cpuUsage ?? 0) * 100) / 100;
	const serverRam = (data[data.length - 1]?.value.ramUsage ?? ramUsage ?? 0) * 1024 * 1024;
	const jvmRam = (data[data.length - 1]?.value.jvmRamUsage ?? jvmRamUsage ?? 0) * 1024 * 1024;
	const totalRam = plan.ram;
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
					{byteToSize(jvmRamUsage * 1024 * 1024)} / {byteToSize(totalRam * 1024 * 1024)} (
					{Math.ceil(((jvmRamUsage ?? 1) / (totalRam ?? 1)) * 10000) / 100}%)
				</span>
			</div>
			<RamUsageChart serverRamUsage={serverRam} nativeRamUsage={nativeRam} totalRam={totalRam * 1024 * 1024} />
			<div className="flex flex-col text-muted-foreground">
				<div>{`Native: ${byteToSize(nativeRam)}`}</div>
				<div>{`Server: ${byteToSize(serverRam)}`}</div>
			</div>
		</div>
	);
}
