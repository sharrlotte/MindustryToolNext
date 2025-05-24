'use client';

import { useParams } from 'next/navigation';
import React, { ReactNode, use } from 'react';

import ErrorMessage from '@/components/common/error-message';
import {
	CmdIcon,
	FileIcon,
	KeyRoundIcon,
	LayoutDashboardIcon,
	LogIcon,
	MapIcon,
	PluginIcon,
	SettingIcon,
	UsersIcon,
} from '@/components/common/icons';
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

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	const ownerId = server?.userId;

	const links: {
		id: string;
		href: string;
		label: ReactNode;
		icon: ReactNode;
		filter?: Filter;
	}[] = [
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
			icon: <CmdIcon />,
			filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
		},
		{
			id: 'map', //
			href: '/maps',
			label: <Tran text="map" />,
			icon: <MapIcon />,
			filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
		},
		{
			id: 'plugin',
			href: '/plugins',
			label: <PluginLabel />,
			icon: <PluginIcon />,
			filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
		},
		{
			id: 'player',
			href: '/players',
			label: <Tran text="player" />,
			icon: <UsersIcon />,
			filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
		},
		{
			id: 'log',
			href: '/logs',
			label: <Tran text="log" />,
			icon: <LogIcon />,
			filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
		},
		{
			id: 'file', //
			href: '/files',
			label: <Tran text="file" />,
			icon: <FileIcon />,
			filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
		},
		{
			id: 'env', //
			href: '/environments',
			label: <Tran text="env" />,
			icon: <KeyRoundIcon />,
			filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
		},
		{
			id: 'setting', //
			href: '/setting',
			label: <Tran text="setting" />,
			icon: <SettingIcon />,
			filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: ownerId }] },
		},
	];

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
				{children}
			</div>
		</div>
	);
}
