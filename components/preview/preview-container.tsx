import React from 'react';
import { cn } from '@/lib/utils';

interface PreviewContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function PreviewContainer({ className, children, ...props }: PreviewContainerProps) {
	return (
		<section
			className={(cn('p-4 grid grid-cols-[repeat(auto-fill,var(--preview-size))] w-full gap-4 justify-center'), className)}
			{...props}
		>
			{children}
		</section>
	);
}
