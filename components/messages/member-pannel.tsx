import { AxiosInstance } from 'axios';
import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { UsersIcon } from '@/components/common/icons';
import InfinitePage from '@/components/common/infinite-page';
import Tran from '@/components/common/tran';
import { MemberCard } from '@/components/messages/member-card';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { getMembers } from '@/query/message';
import { User } from '@/types/response/User';
import { PaginationQuerySchema } from '@/types/schema/search-query';

type MemberPanelState = 'open' | 'closed';

type MemberPanelProps = {
	room: string;
	className?: string;
};

export function MemberPanel({ className, room }: MemberPanelProps) {
	const { state, isSmall } = useMemberPanel();

	return (
		<motion.div
			className={cn(
				'absolute right-0 top-0 flex h-full flex-shrink-0 flex-col items-start no-scrollbar overflow-hidden border-l bg-background md:relative',
				className,
			)}
			animate={state}
			initial="closed"
			variants={{
				open: {
					width: isSmall ? 'min(100%,300px)' : 300,
				},
				closed: {
					width: 0,
				},
			}}
		>
			<div className="px-4 flex items-center h-[45px] border-b w-full">
				<Tran text="member" />
			</div>
			<InfinitePage
				className="px-4 grid gap-2 w-full"
				queryKey={['room', room, 'members']}
				paramSchema={PaginationQuerySchema} //
				queryFn={(axios: AxiosInstance, params: { page: number; size: number }) =>
					getMembers(axios, room, params).then((result) => result.filter((v, i, a) => a.findIndex((v2) => v.id === v2.id) === i))
				}
				noResult={<div></div>}
				end={<div></div>}
			>
				{(page) =>
					groupUserByRole(page).map(([name, group]) => (
						<div key={name} className="grid gap-1">
							<h4 className="font-semibold capitalize">
								<Tran text={name} asChild />
							</h4>
							{group.users.map((user) => (
								<MemberCard key={user.id} user={user} />
							))}
						</div>
					))
				}
			</InfinitePage>
		</motion.div>
	);
}

type MemberPanelContextType = {
	state: MemberPanelState;
	isSmall: boolean;
	setState: (func: (prev: MemberPanelState) => MemberPanelState) => void;
};

export const MemberPanelContext = React.createContext<MemberPanelContextType>({
	state: 'open',
	isSmall: true,
	setState: () => {},
});

export const useMemberPanel = () => React.useContext(MemberPanelContext);

export function MemberPanelProvider({ children }: { children: ReactNode }) {
	const isSmall = useMediaQuery('(max-width: 640px)');

	const [state, setState] = useState<MemberPanelState>(isSmall ? 'closed' : 'open');

	useEffect(() => setState(isSmall ? 'closed' : 'open'), [isSmall]);

	return <MemberPanelContext.Provider value={{ state, isSmall, setState }}>{children}</MemberPanelContext.Provider>;
}

export function MemberPanelTrigger() {
	const { setState } = useMemberPanel();

	return (
		<Button className="p-0" variant="icon" onClick={() => setState((prev) => (prev === 'open' ? 'closed' : 'open'))}>
			<UsersIcon />
		</Button>
	);
}

function groupUserByRole(users: User[]) {
	const result: Record<
		string,
		{
			role: User['roles'][number];
			users: User[];
		}
	> = {};

	const add = (role: User['roles'][number], user: User) => {
		if (!result[role.name]) {
			result[role.name] = {
				role,
				users: [],
			};
		}
		result[role.name].users.push(user);
	};

	for (const user of users) {
		if (!user.roles || user.roles.length === 0) {
			add({ id: 0, name: 'USER', position: 0, description: '', color: '' }, user);
		} else {
			const bestRole = user.roles.sort((a, b) => b.position - a.position)[0];
			add(bestRole, user);
		}
	}

	return Object.entries(result)
		.sort((a, b) => b[1].role.position - a[1].role.position)
		.filter((r) => r[1].users.length > 0);
}
