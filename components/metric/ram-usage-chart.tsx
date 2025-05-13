'use client';

import React from 'react';

import Tran from '@/components/common/tran';
import PieChart from '@/components/metric/pie-chart';

type Props = {
	ramUsage: number;
	totalRam: number;
};

export default function RamUsageChart({ ramUsage, totalRam }: Props) {
	ramUsage = isNaN(ramUsage) ? 0 : ramUsage;
	totalRam = isNaN(totalRam) ? 0 : totalRam;

	let percentUsage = Math.round((ramUsage / totalRam) * 10000) / 100;

	percentUsage = isNaN(percentUsage) ? 0 : percentUsage;

	const percentFree = Math.round((100 - percentUsage) * 100) / 100;

	const ramLeft = ramUsage === 0 && totalRam === 0 ? 100 : totalRam - ramUsage;

	return (
		<div className="space-y-2 rounded-lg bg-card p-2">
			<span className="font-bold">
				<Tran text="metric.ram-usage" />
			</span>
			<div className="max-h-[200px] max-w-[200px] group/chart">
				<PieChart
					segments={[
						{
							percentage: percentUsage,
							color:
								percentUsage < 50
									? 'green' //
									: percentUsage < 70
										? 'gold'
										: 'red',
						},
						{
							percentage: percentFree,
							color: 'white',
						},
					]}
				/>
				<div className="grid">
					<span>
						<Tran text="server.total-ram" />
						{totalRam}
					</span>
					<span>
						<Tran text="server.ram-used" />
						{ramUsage}
					</span>
					<span>
						<Tran text="server.ram-left" />
						{ramLeft}
					</span>
				</div>
			</div>
		</div>
	);
}
