'use client';

import { ReactNode } from 'react';

import { useNavLink } from '@/context/nav-link.context';

type Props = {
	children: ReactNode;
};
export default function NavLinkContainer({ children }: Props) {
	const { setHovered } = useNavLink();

	return (
		<div className="border-b flex h-full gap-3 overflow-x-auto overflow-y-hidden bg-card px-2" onMouseLeave={() => setHovered(null)} onTouchCancel={() => setHovered(null)}>
			{children}
		</div>
	);
}
