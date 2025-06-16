'use client';

import React from 'react';

import { cn } from '@/lib/utils';

import * as ProgressPrimitive from '@radix-ui/react-progress';

type Props = {
	serverRamUsage: number;
	nativeRamUsage: number;
	totalRam: number;
};

export default function RamUsageChart({ serverRamUsage, nativeRamUsage, totalRam }: Props) {
	serverRamUsage = isNaN(serverRamUsage) ? 0 : serverRamUsage;
	totalRam = isNaN(totalRam) ? 0 : totalRam;

	let serverPercentUsage = Math.round((serverRamUsage / totalRam) * 10000) / 100;
	let nativePercentUsage = Math.round((nativeRamUsage / totalRam) * 10000) / 100;

	serverPercentUsage = isNaN(serverPercentUsage) ? 0 : serverPercentUsage;
	nativePercentUsage = isNaN(nativePercentUsage) ? 0 : nativePercentUsage;

	const [nativePercent, setNativePercent] = React.useState(0);
	const [serverPercent, setServerPercent] = React.useState(0);

	React.useEffect(() => {
		const timeout = setTimeout(() => setServerPercent(serverPercentUsage || 0), 100);

		return () => clearTimeout(timeout);
	}, [serverPercentUsage]);

	React.useEffect(() => {
		const timeout = setTimeout(() => setNativePercent(nativePercentUsage || 0), 100);

		return () => clearTimeout(timeout);
	}, [nativePercentUsage]);

	return (
		<ProgressPrimitive.Root className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20')}>
			<ProgressPrimitive.Indicator
				className="h-full w-full flex-1 transition-all duration-500 z-10"
				style={{
					transform: `translateX(-${100 - serverPercent - nativePercent}%)`,
					backgroundColor: 'navy',
				}}
			/>
			<ProgressPrimitive.Indicator
				className="absolute top-0 left-0 h-full w-full flex-1 transition-all duration-500 z-20"
				style={{
					transform: `translateX(-${100 - nativePercent}%)`,
					backgroundColor: 'purple',
				}}
			/>
		</ProgressPrimitive.Root>
	);
}
