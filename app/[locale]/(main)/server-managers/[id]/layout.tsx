'use client';

import { BarChart4, FileIcon, HardDriveIcon, LayoutDashboardIcon, MapIcon, PlugIcon, TerminalIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { ReactNode, use, useMemo } from 'react';

import { CatchError } from '@/components/common/catch-error';
import ErrorMessage from '@/components/common/error-message';
import NavLink from '@/components/common/nav-link';
import NavLinkContainer from '@/components/common/nav-link-container';
import Tran from '@/components/common/tran';

import { NavLinkProvider } from '@/context/nav-link.context';
import { useSession } from '@/context/session.context';
import useServerManager from '@/hooks/use-server-manager';
import ProtectedElement from '@/layout/protected-element';
import ProtectedRoute from '@/layout/protected-route';
import { Filter } from '@/lib/utils';

type LayoutProps = {
	params: Promise<{
		id: string;
	}>;
	children: ReactNode;
};

export default function ServerLayout({ params, children }: LayoutProps) {
	const { id } = use(params);
	const { session } = useSession();
	const { data: server, isError, error } = useServerManager(id);
	const pathname = usePathname();
	const ownerId = server?.userId;

	const links: {
		id: string;
		href: string;
		label: ReactNode;
		icon: ReactNode;
		filter?: Filter;
	}[] = useMemo(
		() => [
			{
				id: 'dashboard',
				href: '',
				label: <Tran text="dashboard" />,
				icon: <LayoutDashboardIcon className="size-5" />,
				filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
			},
			{
				id: 'console',
				href: '/console',
				label: <Tran text="console" />,
				icon: <TerminalIcon className="size-5" />,
				filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
			},
			{
				id: 'map', //
				href: '/maps',
				label: <Tran text="map" />,
				icon: <MapIcon className="size-5" />,
				filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
			},
			{
				id: 'plugin',
				href: '/plugins',
				label: <Tran text="plugin" />,
				icon: <PlugIcon className="size-5" />,
				filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
			},
			{
				id: 'data',
				href: '/data',
				label: <Tran text="data" />,
				icon: <HardDriveIcon className="size-5" />,
				filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
			},
			{
				id: 'metric',
				href: '/metrics',
				label: <Tran text="metric" />,
				icon: <BarChart4 className="size-5" />,
				filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
			},
			{
				id: 'file', //
				href: '/files',
				label: <Tran text="file" />,
				icon: <FileIcon className="size-5" />,
				filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
			},
		],
		[ownerId],
	);

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	const filter = links.find((link) => pathname.endsWith(link.href))?.filter;

	return (
		<div className="grid h-full grid-flow-row grid-rows-[48px_1fr] overflow-hidden">
			<NavLinkProvider>
				<NavLinkContainer>
					{links.map((item) => (
						<ProtectedElement key={item.id} session={session} filter={item.filter}>
							<NavLink {...item} root={`server-managers/${id}`} />
						</ProtectedElement>
					))}
				</NavLinkContainer>
			</NavLinkProvider>
			<div className="flex overflow-hidden flex-col w-full h-full" key="child">
				<CatchError>
					<ProtectedRoute filter={filter}>{children}</ProtectedRoute>
				</CatchError>
			</div>
		</div>
	);
}
