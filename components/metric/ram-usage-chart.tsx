'use client';

import React from 'react';

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

	return (
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
	);
}
