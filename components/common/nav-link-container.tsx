'use client';

import { AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

import { useNavLink } from '@/context/nav-link-context';

type Props = {
	children: ReactNode;
};
export default function NavLinkContainer({ children }: Props) {
	const { setHovered } = useNavLink();

	return (
		<div className="no-scrollbar border-b flex h-full gap-3 overflow-x-auto bg-card px-2" onMouseLeave={() => setHovered(null)} onTouchCancel={() => setHovered(null)}>
			<AnimatePresence>{children}</AnimatePresence>
		</div>
	);
}
