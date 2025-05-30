'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import * as ProgressPrimitive from '@radix-ui/react-progress';

const CpuProgress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
	const [percent, setPercent] = React.useState(0);

	React.useEffect(() => {
		const timeout = setTimeout(() => setPercent(Math.min(100, value || 0)), 50);

		return () => clearTimeout(timeout);
	}, [value]);

	return (
		<ProgressPrimitive.Root
			ref={ref}
			className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className="h-full w-full flex-1 bg-primary transition-all duration-500"
				style={{ transform: `translateX(-${100 - (percent || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
});
CpuProgress.displayName = 'CpuProgress';

export default CpuProgress;
