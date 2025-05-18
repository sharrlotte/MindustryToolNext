'use client';

import { useState } from 'react';

import ColorText from '@/components/common/color-text';
import ComboBox from '@/components/common/combo-box';
import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import { BanButton } from '@/components/server/ban.button';
import { KickButton } from '@/components/server/kick.button';
import Divider from '@/components/ui/divider';
import { EllipsisButton } from '@/components/ui/ellipsis-button';

import { cn } from '@/lib/utils';
import { getServerPlayerInfos } from '@/query/server';
import { PlayerInfo } from '@/types/response/PlayerInfo';
import { PlayerInfoQuerySchema } from '@/types/schema/search-query';

type Props = {
	id: string;
};

const state = {
	true: 'Banned',
	false: 'Not Banned',
	undefined: 'All',
};

export default function PageClient({ id }: Props) {
	const [banned, setBanned] = useState<boolean | undefined>(undefined);

	return (
		<ScrollContainer className="p-2 flex flex-col gap-2">
			<div>
				<ComboBox
					searchBar={false}
					chevron={false}
					value={{
						label: state[String(banned) as keyof typeof state],
						value: banned,
					}}
					values={[
						{
							label: 'Banned',
							value: true,
						},
						{
							label: 'Not Banned',
							value: false,
						},
						{
							label: 'All',
							value: undefined,
						},
					]}
					onChange={(value) => setBanned(value)}
				/>
			</div>
			<Divider />
			<InfinitePage
				className="grid grid-cols-1 gap-2"
				queryKey={['server', id, 'player-info']}
				params={{ banned }}
				paramSchema={PlayerInfoQuerySchema}
				queryFn={(axios, params) => getServerPlayerInfos(axios, id, params)}
			>
				{(data) => data.map((item) => <PlayerInfoCard key={item.id} serverId={id} info={item} />)}
			</InfinitePage>
		</ScrollContainer>
	);
}

type PlayerInfoCardProps = {
	serverId: string;
	info: PlayerInfo;
};

function PlayerInfoCard({ serverId, info }: PlayerInfoCardProps) {
	const { lastKicked, lastIP, lastName, id, names, banned, admin, adminUsid, ips, timesJoined, timesKicked } = info;
	const lastKickedDate = lastKicked ? new Date(lastKicked).toLocaleString() : 'Never';

	return (
		<div
			className={cn('p-2 border bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow relative', {
				'bg-destructive border-destructive-foreground': banned,
			})}
		>
			<div className="flex justify-between items-start">
				<div>
					<h4 className="font-medium text-lg">
						<ColorText text={lastName} />
					</h4>
					<div className="text-sm text-muted-foreground">ID: {id}</div>
				</div>
				<div className="flex gap-2">
					{admin && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Admin</span>}
					{banned && <span className="px-2 py-1 text-xs bg-red-200 text-red-800 rounded-full">Banned</span>}
				</div>
			</div>

			<div className="mt-4 grid grid-cols-2 gap-4 text-sm">
				<div>
					<div className="text-muted-foreground">Last IP</div>
					<div className="font-mono">{lastIP}</div>
				</div>
				<div>
					<div className="text-muted-foreground">IPs</div>
					<div className="font-mono">{ips.join(', ')}</div>
				</div>
				<div>
					<div className="text-muted-foreground">Admin USID</div>
					<div className="font-mono truncate">{adminUsid || 'N/A'}</div>
				</div>
				<div>
					<div className="text-sm text-muted-foreground mb-1">Known Names</div>
					<div className="flex flex-wrap gap-2">
						{names.map((name, index) => (
							<span key={index} className="px-2 py-1 text-xs rounded-full bg-secondary border">
								<ColorText text={name} />
							</span>
						))}
					</div>
				</div>
				<div>
					<div className="text-muted-foreground">Times Joined</div>
					<div>{timesJoined}</div>
				</div>
				<div>
					<div className="text-muted-foreground">Times Kicked</div>
					<div>{timesKicked}</div>
				</div>
			</div>
			<div className="mt-4 grid grid-cols-2 gap-4 text-sm">
				<div>
					{lastKicked > 0 && (
						<>
							<div className="text-sm text-muted-foreground mb-1">Last Kicked</div>
							<div className="text-xs font-mono">{lastKickedDate}</div>
						</>
					)}
				</div>
			</div>
			<EllipsisButton className="absolute m-2 top-0 right-0" variant="ghost">
				<KickButton id={serverId} uuid={id} />
				<BanButton id={serverId} ip={lastIP} username={lastName} uuid={id} />
			</EllipsisButton>
		</div>
	);
}
