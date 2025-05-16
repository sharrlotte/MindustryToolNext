import React, { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type DividerProps = HTMLAttributes<HTMLDivElement> & {
	className?: string;
	orientation?: 'horizontal' | 'vertical';
};

export default function Divider({ className, orientation = 'horizontal', ...props }: DividerProps) {
	return (
		<div
			className={cn(
				'border-border',
				{
					'border-b h-0 ': orientation === 'horizontal',
					'border-r w-0': orientation === 'vertical',
				},
				className,
			)}
			{...props}
		></div>
	);
}
