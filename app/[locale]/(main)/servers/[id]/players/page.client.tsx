'use client';

import { useState } from 'react';

import ColorText from '@/components/common/color-text';
import ComboBox from '@/components/common/combo-box';
import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import Divider from '@/components/ui/divider';

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
				{(data) => data.map((item) => <PlayerInfoCard key={item.id} info={item} />)}
			</InfinitePage>
		</ScrollContainer>
	);
}

type PlayerInfoCardProps = {
	info: PlayerInfo;
};

function PlayerInfoCard({ info }: PlayerInfoCardProps) {
	const lastKickedDate = info.lastKicked ? new Date(info.lastKicked).toLocaleString() : 'Never';

	return (
		<div
			className={cn('p-2 border bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow', {
				'bg-destructive border-destructive-foreground': info.banned,
			})}
		>
			<div className="flex justify-between items-start">
				<div>
					<h4 className="font-medium text-lg">
						<ColorText text={info.lastName} />
					</h4>
					<div className="text-sm text-muted-foreground">ID: {info.id}</div>
				</div>
				<div className="flex gap-2">
					{info.admin && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Admin</span>}
					{info.banned && <span className="px-2 py-1 text-xs bg-red-200 text-red-800 rounded-full">Banned</span>}
				</div>
			</div>

			<div className="mt-4 grid grid-cols-2 gap-4 text-sm">
				<div>
					<div className="text-muted-foreground">Last IP</div>
					<div className="font-mono">{info.lastIP}</div>
				</div>
				<div>
					<div className="text-muted-foreground">IPs</div>
					<div className="font-mono">{info.ips.join(', ')}</div>
				</div>
				<div>
					<div className="text-muted-foreground">Admin USID</div>
					<div className="font-mono truncate">{info.adminUsid || 'N/A'}</div>
				</div>
				<div>
					<div className="text-sm text-muted-foreground mb-1">Known Names</div>
					<div className="flex flex-wrap gap-2">
						{info.names.map((name, index) => (
							<span key={index} className="px-2 py-1 text-xs rounded-full bg-secondary border">
								<ColorText text={name} />
							</span>
						))}
					</div>
				</div>
				<div>
					<div className="text-muted-foreground">Times Joined</div>
					<div>{info.timesJoined}</div>
				</div>
				<div>
					<div className="text-muted-foreground">Times Kicked</div>
					<div>{info.timesKicked}</div>
				</div>
			</div>
			<div className="mt-4 grid grid-cols-2 gap-4 text-sm">
				<div>
					{info.lastKicked && (
						<>
							<div className="text-sm text-muted-foreground mb-1">Last Kicked</div>
							<div className="text-xs font-mono">{lastKickedDate}</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
