import React from 'react';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';

interface PreviewCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function PreviewCard({ className, children, ...props }: PreviewCardProps) {
	return (
		<Card
			className={cn('w-preview min-h-preview animate-appear', className)}
			{...props}
		>
			{children}
		</Card>
	);
}
