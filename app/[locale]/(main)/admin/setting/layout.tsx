import { ReactNode } from 'react';
import React from 'react';

import { CatchError } from '@/components/common/catch-error';
import { GanttChartIcon, ImageIcon, ModIcon, NotificationIcon, SettingIcon, TagIcon, UsersIcon } from '@/components/common/icons';
import NavLink from '@/components/common/nav-link';
import NavLinkContainer from '@/components/common/nav-link-container';
import Tran from '@/components/common/tran';

import { getSession } from '@/action/action';
import { NavLinkProvider } from '@/context/nav-link-context';
import ProtectedElement from '@/layout/protected-element';
import { Filter } from '@/lib/utils';

const links: {
	id: string;
	href: string;
	label: ReactNode;
	icon: ReactNode;
	filter?: Filter;
}[] = [
	{
		id: 'users',
		href: '',
		label: <Tran text="user" />,
		icon: <GanttChartIcon />,
		filter: { authority: 'EDIT_USER_AUTHORITY' },
	},
	{
		id: 'role',
		href: 'roles',
		label: <Tran text="role" />,
		icon: <UsersIcon />,
		filter: { authority: 'EDIT_ROLE_AUTHORITY' },
	},
	{
		id: 'tag',
		href: 'tags',
		label: <Tran text="tag" />,
		icon: <TagIcon />,
		filter: { authority: 'MANAGE_TAG' },
	},
	{
		id: 'mod',
		href: 'mods',
		label: <Tran text="mod" />,
		icon: <ModIcon />,
		filter: { authority: 'MANAGE_TAG' },
	},
	{
		id: 'notification',
		href: 'notifications',
		label: <Tran text="notification" />,
		icon: <NotificationIcon />,
		filter: { authority: 'CREATE_NOTIFICATION' },
	},
	{
		id: 'config',
		label: <Tran text="setting" />,
		href: 'config',
		icon: <SettingIcon />,
		filter: { authority: 'VIEW_SETTING' },
	},
	{
		id: 'image',
		label: <Tran text="image" />,
		href: 'image',
		icon: <ImageIcon className="size-5" />,
		filter: { authority: 'VIEW_SETTING' },
	},
];

type LayoutProps = {
	children: ReactNode;
};

export default async function ServerLayout({ children }: LayoutProps) {
	const session = await getSession();

	return (
		<div className="grid h-full grid-flow-row grid-rows-[48px_1fr] overflow-hidden">
			<NavLinkProvider>
				<NavLinkContainer>
					{links.map((item) => (
						<ProtectedElement key={item.id} session={session} filter={item.filter ?? true}>
							<NavLink {...item} root="admin/setting" />
						</ProtectedElement>
					))}
				</NavLinkContainer>
			</NavLinkProvider>
			<CatchError>
				<div className="h-full w-full overflow-hidden flex flex-col p-2" key="child">
					{children}
				</div>
			</CatchError>
		</div>
	);
}
