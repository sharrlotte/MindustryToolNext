'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

import InternalLink from '@/components/common/internal-link';

import { useNavLink } from '@/context/nav-link.context';
import { cn } from '@/lib/utils';

type Props = {
	href: string;
	label: ReactNode;
	icon: ReactNode;
	root: string;
};

export default function NavLink({ root, href, label, icon }: Props) {
	const { hovered, setHovered } = useNavLink();
	const pathname = usePathname();
	const firstSlash = pathname.indexOf('/', 1);
	const route = pathname.slice(firstSlash);

	const isSelected = (route.endsWith(href) && href !== '') || (href === '' && route === `/${root}`);
	const isHovered = href === hovered;

	return (
		<InternalLink
			className={cn(
				'relative inline-flex h-12 min-w-fit items-center justify-center gap-2 text-nowrap px-0 py-4 text-sm text-foreground/50 hover:text-foreground',
				{
					'text-foreground': isSelected,
				},
			)}
			href={`/${root}/${href}`}
			onMouseEnter={() => setHovered(href)}
			onTouchStart={() => setHovered(href)}
		>
			<div className="relative w-full">
				{isHovered && <motion.div layout layoutId="nav-link-hovered" className="absolute inset-0 z-0 rounded-sm bg-secondary" />}
				{isSelected && (
					<motion.div
						layout
						layoutId="nav-link-indicator"
						className="absolute bottom-0 left-0 right-0 h-0.5 border-b-[3px] border-foreground"
					/>
				)}
				<div
					className={cn('relative z-10 h-9 bg-transparent px-2 py-1 flex items-center text-foreground/50 hover:text-foreground', {
						'text-foreground': isSelected,
					})}
				>
					<div className="relative flex w-fit items-end justify-center gap-1 rounded-sm">
						<span>{icon}</span>
						{label}
					</div>
				</div>
			</div>
		</InternalLink>
	);
}
