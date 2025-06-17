'use client';

import {
	FileIcon,
	HardDriveIcon,
	LayoutDashboardIcon,
	MapIcon,
	PlugIcon,
	SettingsIcon,
	TerminalIcon,
	WorkflowIcon,
} from 'lucide-react';
import React, { ReactNode, Suspense, use, useMemo } from 'react';

import { CatchError } from '@/components/common/catch-error';
import ErrorMessage from '@/components/common/error-message';
import NavLink from '@/components/common/nav-link';
import NavLinkContainer from '@/components/common/nav-link-container';
import { NotificationNumber } from '@/components/common/notification-number';
import Tran from '@/components/common/tran';

import { NavLinkProvider } from '@/context/nav-link.context';
import { useSession } from '@/context/session.context';
import useClientApi from '@/hooks/use-client';
import useServer from '@/hooks/use-server';
import useServerPlugins from '@/hooks/use-server-plugins';
import ProtectedElement from '@/layout/protected-element';
import ProtectedRoute from '@/layout/protected-route';
import { Filter } from '@/lib/utils';

import { useQuery } from '@tanstack/react-query';

import { useParams, usePathname } from 'next/navigation';

type LayoutProps = {
	params: Promise<{
		id: string;
	}>;
	children: ReactNode;
};

function PluginLabel() {
	const { id } = useParams();
	const { data } = useServerPlugins(id as string);
	const axios = useClientApi();

	const shouldCheckPlugins = data
		?.map((p) => p.filename.replace('.jar', '').split('_'))
		.filter((p) => p.length === 2)
		.filter((p) => !!p[1])
		.map((p) => ({
			id: p[0],
			version: p[1],
		}));

	const { data: version } = useQuery({
		queryKey: ['server', id, 'plugin-version', data],
		queryFn: () =>
			axios
				.post('plugins/check-version', shouldCheckPlugins, { withCredentials: true })
				.then((res) => res.data as { id: string; version: string }[]),
		enabled: !!shouldCheckPlugins && shouldCheckPlugins.length > 0,
	});

	return (
		<NotificationNumber number={version?.length ?? 0}>
			<Tran text="plugin" />
		</NotificationNumber>
	);
}

export default function Layout({ params, children }: LayoutProps) {
	const { id } = use(params);
	const { session } = useSession();
	const { data: server, isError, error } = useServer(id);
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
			},
			{
				id: 'console',
				href: '/console',
				label: <Tran text="console" />,
				icon: <TerminalIcon className="size-5" />,
				filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
			},
			{
				id: 'stats',
				href: '/stats',
				label: <Tran text="stats" />,
				icon: (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="lucide lucide-chart-no-axes-combined-icon lucide-chart-no-axes-combined size-5"
					>
						<path d="M12 16v5" />
						<path d="M16 14v7" />
						<path d="M20 10v11" />
						<path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
						<path d="M4 18v3" />
						<path d="M8 14v7" />
					</svg>
				),
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
				label: <PluginLabel />,
				icon: <PlugIcon className="size-5" />,
				filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
			},
			{
				id: 'workflow',
				href: '/workflows',
				label: <Tran text="workflow" />,
				icon: <WorkflowIcon className="size-5" />,
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
				id: 'file', //
				href: '/files',
				label: <Tran text="file" />,
				icon: <FileIcon className="size-5" />,
				filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
			},
			{
				id: 'setting', //
				href: '/setting',
				label: <Tran text="setting" />,
				icon: <SettingsIcon className="size-5" />,
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
							<NavLink {...item} root={`servers/${id}`} />
						</ProtectedElement>
					))}
				</NavLinkContainer>
			</NavLinkProvider>
			<div className="flex overflow-hidden flex-col w-full h-full relative" key="child">
				<CatchError>
					<Suspense>
						<ProtectedRoute filter={filter}>{children}</ProtectedRoute>
					</Suspense>
				</CatchError>
			</div>
		</div>
	);
}
