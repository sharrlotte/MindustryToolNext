import { Suspense } from 'react';

import ColorText from '@/components/common/color-text';
import ErrorScreen from '@/components/common/error-screen';
import { BanButton } from '@/components/server/ban-button';
import { KickButton } from '@/components/server/kick-button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Skeleton } from '@/components/ui/skeleton';
import IdUserCard from '@/components/user/id-user-card';

import { serverApi } from '@/action/action';
import localeToFlag, { isError } from '@/lib/utils';
import { getServerPlayers } from '@/query/server';
import { Player } from '@/types/response/Player';

type PlayersCardProps = {
	id: string;
};

export async function PlayersCard({ id }: PlayersCardProps) {
	const players = await serverApi((axios) => getServerPlayers(axios, id));

	if (isError(players)) {
		return <ErrorScreen error={players} />;
	}

	return (
		<div className="grid gap-1 min-w-[300px]">
			{players
				.sort((a, b) => a.team.name.localeCompare(b.team.name))
				.map((player) => (
					<PlayerCard key={player.uuid} serverId={id} player={player} />
				))}
		</div>
	);
}

type PlayersCardSkeletonProps = {
	players: number;
};
export function PlayersCardSkeleton({ players }: PlayersCardSkeletonProps) {
	if (players === 0) {
		return undefined;
	}

	return Array(players)
		.fill(1)
		.map((_, index) => <Skeleton className="h-10 w-24" key={index} />);
}

type PlayerCardProps = {
	serverId: string;
	player: Player;
};

function getCountryCode(locale: string): string {
	const parts = locale.split('_');
	return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase();
}
async function PlayerCard({ serverId, player: { locale, userId, name, team, ip, uuid } }: PlayerCardProps) {
	locale = getCountryCode(locale ?? 'EN');

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<div className="flex flex-col justify-between gap-1 px-4 py-1 hover:bg-secondary">
					<div className="flex text-lg justify-between gap-1">
						<ColorText className="font-semibold" text={name} />
						{locale && (localeToFlag[locale] ?? locale)}
						{userId && <IdUserCard id={userId} />}
					</div>
					<div className="border-b-4" style={{ borderColor: `#${team.color}` }} />
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<Suspense>
					<ContextMenuItem asChild>
						<BanButton id={serverId} uuid={uuid} username={name} ip={ip} />
					</ContextMenuItem>
					<ContextMenuItem asChild>
						<KickButton id={serverId} username={name} />
					</ContextMenuItem>
				</Suspense>
			</ContextMenuContent>
		</ContextMenu>
	);
}
