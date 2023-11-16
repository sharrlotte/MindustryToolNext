import { cn } from '@/lib/utils';
import React, { HTMLAttributes } from 'react';

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export default function Divider({ className, ...props }: DividerProps) {
	return (
		<div
			className={cn('h-0 border-b-2 border-slate-500', className)}
			{...props}
		></div>
	);
}
