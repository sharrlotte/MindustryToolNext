'use client';

import { usePathname } from 'next/navigation';
import React, { ReactNode, forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';

import { CatchError } from '@/components/common/catch-error';

import { cn } from '@/lib/utils';

type AdditionalPadding = `pr-${number}`;
type Props = {
	id?: string;
	className?: string;
	additionalPadding?: AdditionalPadding;
	children: ReactNode;
} & React.ComponentPropsWithoutRef<'div'>;

const ScrollContainer = forwardRef<HTMLDivElement, Props>(({ className, id, children }, forwardedRef) => {
	const pathname = usePathname();
	const innerRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(forwardedRef, () => innerRef.current!, []);

	const scrollKey = useMemo(() => `scroll-top${pathname}-${id}`.replaceAll('/', '-'), [id, pathname]);

	useEffect(() => {
		const scrollTop = localStorage.getItem(scrollKey);
		const div = innerRef.current;

		if (div && scrollTop) {
			try {
				setTimeout(() => {
					if (innerRef.current?.scrollTop !== parseInt(scrollTop)) div.scrollTo({ top: parseInt(scrollTop), behavior: 'smooth' });
				}, 0);
				div.scrollTo({ top: parseInt(scrollTop) });
			} catch (error) {
				console.error(error);
			}
		}
	}, [scrollKey]);

	const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
		localStorage.setItem(scrollKey, event.currentTarget.scrollTop.toString());
	};

	return (
		<CatchError>
			<div
				id={id}
				ref={innerRef}
				className={cn('h-fit scroll-container overflow-y-auto w-full', className)}
				onScroll={handleScroll}
			>
				{children}
			</div>
		</CatchError>
	);
});

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
