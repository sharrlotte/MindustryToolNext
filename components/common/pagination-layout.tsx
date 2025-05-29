'use client';

import { LayoutGridIcon, List } from 'lucide-react';
import { ReactNode } from 'react';

import { useSession } from '@/context/session.context';
import { cn } from '@/lib/utils';

type Props = {
	children: ReactNode;
};

export function PaginationLayoutSwitcher() {
	const {
		config: { paginationType },
		setConfig,
	} = useSession();

	return (
		<div className="bg-card rounded-md overflow-hidden shadow-md flex">
			<button
				className={cn('p-2 h-full', {
					'bg-secondary hover:bg-secondary bg-opacity-80 text-secondary-foreground': paginationType === 'grid',
				})}
				onClick={() => setConfig('paginationType', 'grid')}
				title="Grid"
			>
				<LayoutGridIcon className="h-full" />
			</button>
			<button
				className={cn('p-2 h-full', {
					'bg-secondary hover:bg-secondary text-secondary-foreground bg-opacity-80': paginationType === 'infinite-scroll',
				})}
				onClick={() => setConfig('paginationType', 'infinite-scroll')}
				title="List"
			>
				<List className="h-full" />
			</button>
		</div>
	);
}

export function ListLayout({ children }: Props) {
	const {
		config: { paginationType },
	} = useSession();

	return paginationType === 'infinite-scroll' ? children : undefined;
}

export function GridLayout({ children }: Props) {
	const {
		config: { paginationType },
	} = useSession();

	return paginationType === 'grid' ? children : undefined;
}

export function PaginationFooter({ className, children }: { className?: string; children: ReactNode }) {
	return <div className={cn('flex justify-between gap-2 items-end', className)}>{children}</div>;
}
