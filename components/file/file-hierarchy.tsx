import React from 'react';

import { ChevronRightIcon, HomeIcon } from '@/components/common/icons';

import { cn } from '@/lib/utils';

type Props = {
	path: string;
	onClick: (path: string) => void;
};

export default function FileHierarchy({ path, onClick }: Props) {
	return (
		<div className="space-x-1 whitespace-nowrap min-h-8 flex items-center text-muted-foreground">
			<span className="cursor-pointer pl-2" onClick={() => onClick('')}>
				<HomeIcon />
			</span>
			{path
				?.split('/')
				.filter(Boolean)
				.map((p, index, array) => (
					<div
						className={cn('space-x-1 flex items-center text-foreground', {
							'cursor-pointer text-muted-foreground': index !== array.length - 1,
						})}
						key={index}
					>
						<span>{index <= array.length - 1 && <ChevronRightIcon />}</span>
						<span onClick={() => onClick('/' + array.slice(0, index + 1).join('/'))}> {p}</span>
					</div>
				))}
		</div>
	);
}
