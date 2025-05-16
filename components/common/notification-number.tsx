import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type NotificationNumberProps = {
	className?: string;
	number: number;
	children: ReactNode;
};

export function NotificationNumber({ className, number, children }: NotificationNumberProps) {
	if (number === 0) {
		return children;
	}

	const text = number > 99 ? '99+' : number;

	return (
		<div className="relative">
			{children}
			<span
				className={cn(
					'absolute -right-2 -top-2 inline-flex dark:text-foreground text-background h-4 min-w-4 text-center text-xs rounded-full bg-red-500 p-1 justify-between items-center',
					className,
				)}
			>
				<span className="w-full">{text}</span>
			</span>
		</div>
	);
}
