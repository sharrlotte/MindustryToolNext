import React from 'react';

import { cn } from '@/lib/utils';

type Props = {
	className?: string;
	message?: string;
};

export default function LoadingSpinner({ className, message }: Props) {
	return (
		<svg
			className={cn(
				'm-auto size-6 z-50 text-white min-w-4 min-h-4 max-h-8 max-w-8 animate-spin fill-emerald-500 flex justify-center item-center',
				className,
			)}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
			<path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
			{message}
		</svg>
	);
}
