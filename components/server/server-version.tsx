import React from 'react';

import { cn } from '@/lib/utils';

const colors = {
	V7Build146: 'text-blue-500',
	V8Build149: 'text-pink-500',
	Beta: 'text-purple-600',
} as const;

export default function ServerVersion({
	children,
}: Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & { children: string }) {
	return (
		<span className={cn('text-nowrap text-amber-600 font-semibold', colors[children as keyof typeof colors])}>{children}</span>
	);
}
