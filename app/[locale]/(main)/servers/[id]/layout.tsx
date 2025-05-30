'use client';

import {
	BarChart4,
	FileIcon,
	HardDriveIcon,
	HistoryIcon,
	LayoutDashboardIcon,
	MapIcon,
	PlugIcon,
	SettingsIcon,
	TerminalIcon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { ReactNode, use, useMemo } from 'react';

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
import { Filter } from '@/lib/utils';

import { useQuery } from '@tanstack/react-query';

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

export default function ServerLayout({ params, children }: LayoutProps) {
	const { id } = use(params);
	const { session } = useSession();
	const { data: server, isError, error } = useServer(id);

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
			<div className="flex overflow-hidden flex-col w-full h-full" key="child">
				<CatchError>{children}</CatchError>
			</div>
		</div>
	);
}
