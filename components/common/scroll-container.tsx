'use client';

import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

import { CatchError } from '@/components/common/catch-error';

import { cn } from '@/lib/utils';

type AdditionalPadding = `pr-${number}`;
type Props = {
	id?: string;
	className?: string;
	additionalPadding?: AdditionalPadding;
	children: ReactNode;
	as?: 'div' | 'ul' | 'ol' | 'section';
};

const ScrollContainer = React.forwardRef<HTMLDivElement, Props>(({ className, id, children, as = 'div' }, forwardedRef) => {
	const pathname = usePathname();
	const lastScrollTop = React.useRef(0);

	const Component = as;

	function handle(container: HTMLDivElement | null) {
		if (!container) return;

		const scrollTop = sessionStorage.getItem(`scroll-top-${pathname}-${id}`);
		try {
			if (scrollTop) {
				container.scrollTop = parseInt(scrollTop);
			} else {
				container.scrollTop = lastScrollTop.current;
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<CatchError>
			<Component
				id={id}
				className={cn('h-fit scroll-container overflow-y-auto w-full', className)}
				onScroll={(event) => {
					lastScrollTop.current = event.currentTarget.scrollTop;
					sessionStorage.setItem(`scroll-top-${pathname}-${id}`, event.currentTarget.scrollTop.toString());
				}}
				ref={(current: any) => {
					if (typeof forwardedRef === 'function') {
						forwardedRef(current);
						handle(current);
					} else if (forwardedRef !== null) {
						forwardedRef.current = current;
					} else {
						handle(current);
					}
				}}
			>
				{children}
			</Component>
		</CatchError>
	);
});

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
