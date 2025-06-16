'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import * as ProgressPrimitive from '@radix-ui/react-progress';

const CpuProgress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
		maxValue: number;
	}
>(({ className, value, maxValue, ...props }, ref) => {
	const [percent, setPercent] = React.useState(0);

	React.useEffect(() => {
		const fixed = value || 0;

		const timeout = setTimeout(() => setPercent(Math.min((fixed / maxValue) * 100, 100)), 50);

		return () => clearTimeout(timeout);
	}, [maxValue, value]);

	return (
		<ProgressPrimitive.Root
			ref={ref}
			className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className="h-full w-full flex-1 transition-all duration-500"
				style={{
					transform: `translateX(-${100 - (percent || 0)}%)`,
					backgroundColor:
						percent < 50
							? 'green' //
							: percent < 75
								? 'gold'
								: 'red',
				}}
			/>
		</ProgressPrimitive.Root>
	);
});
CpuProgress.displayName = 'CpuProgress';

export default CpuProgress;
