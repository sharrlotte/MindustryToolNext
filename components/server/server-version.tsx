import React from 'react';

import { cn } from '@/lib/utils';

const colors = {
	V7Build146: 'bg-blue-500',
	V8Build149: 'bg-pink-500',
	Beta: 'bg-purple-600',
} as const;

export default function ServerVersion({
	children,
}: Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & { children: string }) {
	return (
		<span
			className={cn('rounded-xl text-nowrap bg-amber-600 text-white text-xs px-2 py-1', colors[children as keyof typeof colors])}
		>
			{children}
		</span>
	);
}
