'use client';

import { Transition, motion } from 'framer-motion';
import React, { ReactNode } from 'react';

import { useNavBar } from '@/context/navbar.context';
import { cn } from '@/lib/utils';

type Props = {
	children: ReactNode;
};

const sidebarVariants = {
	open: {
		width: '235px',
		transition: { ease: ['easeIn', 'easeOut'], stiffness: 250, duration: 0.1 } as Transition,
		display: 'flex',
	},
	closed: {
		width: 'var(--nav)',
		transition: { ease: ['easeIn', 'easeOut'], stiffness: 200, duration: 0.1 },
		display: 'flex',
	},
};

export default function MediumNavbarCollapse({ children }: Props) {
	const { visible } = useNavBar();

	return (
		<motion.div
			className={cn('flex overflow-hidden relative flex-col gap-2 p-1 w-full h-full divide-y min-w-nav', {
				'p-2': visible,
			})}
			variants={sidebarVariants}
			initial={visible ? { width: sidebarVariants.open.width } : { width: sidebarVariants.closed.width }}
			animate={visible ? 'open' : 'closed'}
		>
			{children}
		</motion.div>
	);
}
