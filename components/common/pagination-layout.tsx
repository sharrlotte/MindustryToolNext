'use client';

import { LayoutGridIcon, List } from 'lucide-react';
import { ReactNode } from 'react';

import Hydrated from '@/components/common/hydrated';

import useConfig from '@/hooks/use-config';
import { cn } from '@/lib/utils';

type Props = {
	children: ReactNode;
};

export function PaginationLayoutSwitcher() {
	const { paginationType, setConfig } = useConfig();

	return (
		<div className="bg-card rounded-md overflow-hidden shadow-md flex">
			<Hydrated>
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
			</Hydrated>
		</div>
	);
}

export function ListLayout({ children }: Props) {
	const { paginationType } = useConfig();

	return paginationType === 'infinite-scroll' ? children : undefined;
}

export function GridLayout({ children }: Props) {
	const { paginationType } = useConfig();

	return paginationType === 'grid' ? children : undefined;
}

export function PaginationFooter({ className, children }: { className?: string; children: ReactNode }) {
	return <div className={cn('flex justify-between gap-2 items-end mt-auto', className)}>{children}</div>;
}
