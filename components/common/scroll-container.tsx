'use client';

import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

import { cn } from '@/lib/utils';

import { usePathname } from 'next/navigation';

type Props = {
	id?: string;
	className?: string;
	children: ReactNode;
} & React.ComponentPropsWithoutRef<'div'>;

export default function ScrollContainer({ className, id, children, ...rest }: Props) {
	const pathname = usePathname();
	const innerRef = useRef<HTMLDivElement>(null);
	const scrollKey = useMemo(() => `scroll-top${pathname}-${id}`.replaceAll('/', '-'), [id, pathname]);

	useEffect(() => {
		try {
			const scrollTop = localStorage.getItem(scrollKey);
			const div = innerRef.current;

			if (div && scrollTop) {
				div.scrollTop = parseInt(scrollTop);
				setTimeout(() => div.scrollTo({ top: parseInt(scrollTop) }), 0);
			}
		} catch (error) {
			console.error(error);
		}
	}, [scrollKey]);

	const handleScroll = useDebounceCallback(
		(event: React.UIEvent<HTMLDivElement>) => localStorage.setItem(scrollKey, event.currentTarget.scrollTop.toString()),
		500,
	);

	return (
		<div
			{...rest}
			ref={innerRef}
			className={cn('h-fit scroll-container overflow-y-auto w-full', className)}
			onScroll={handleScroll}
		>
			{children}
		</div>
	);
}
