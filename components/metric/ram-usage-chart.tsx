'use client';

import React from 'react';

import { cn } from '@/lib/utils';

import * as ProgressPrimitive from '@radix-ui/react-progress';

type Props = {
	ramUsage: number;
	totalRam: number;
};

export default function RamUsageChart({ ramUsage, totalRam }: Props) {
	ramUsage = isNaN(ramUsage) ? 0 : ramUsage;
	totalRam = isNaN(totalRam) ? 0 : totalRam;

	let percentUsage = Math.round((ramUsage / totalRam) * 10000) / 100;

	percentUsage = isNaN(percentUsage) ? 0 : percentUsage;

	const [percent, setPercent] = React.useState(0);

	React.useEffect(() => {
		const timeout = setTimeout(() => setPercent(percentUsage || 0), 100);

		return () => clearTimeout(timeout);
	}, [percentUsage]);

	return (
		<ProgressPrimitive.Root className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20')}>
			<ProgressPrimitive.Indicator
				className="h-full w-full flex-1 transition-all duration-500"
				style={{
					transform: `translateX(-${100 - (percent || 0)}%)`,
					backgroundColor:
						percentUsage < 50
							? 'green' //
							: percentUsage < 70
								? 'gold'
								: 'red',
				}}
			/>
		</ProgressPrimitive.Root>
	);
}
