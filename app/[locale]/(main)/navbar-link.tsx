'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import NavbarVisible from '@/app/[locale]/(main)/navbar-visible';

import InternalLink from '@/components/common/internal-link';

import { useNavBar } from '@/context/navbar.context';
import { useSession } from '@/context/session.context';
import { Filter, cn, hasAccess } from '@/lib/utils';

type Props = {
	icon: React.ReactNode;
	name: React.ReactNode;
	path: string;
	regex: string[];
	filter?: Filter;
};
export default function NavbarLink({ name, icon, path, regex, filter }: Props) {
	const { session } = useSession();
	const { visible, setVisible } = useNavBar();
	const currentPath = usePathname();

	return hasAccess(session, filter) ? (
		<InternalLink
			className={cn(
				'flex h-9 animate-appear items-center text-foreground/60 capitalize justify-center rounded-md p-1 hover:bg-brand hover:text-brand-foreground text-sm',
				{
					'bg-brand text-brand-foreground': regex.some((r) => currentPath.match(r)),
					'justify-start gap-2 py-2': visible,
					'w-10': !visible,
				},
			)}
			href={path}
			aria-label={path}
			onClick={() => setVisible(false)}
		>
			{icon}
			<NavbarVisible>{name}</NavbarVisible>
		</InternalLink>
	) : undefined;
}
