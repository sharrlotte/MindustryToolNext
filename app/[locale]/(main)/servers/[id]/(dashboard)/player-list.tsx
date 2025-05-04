'use client';

import ColorText from '@/components/common/color-text';
import ErrorMessage from '@/components/common/error-message';
import { BanButton } from '@/components/server/ban.button';
import { KickButton } from '@/components/server/kick.button';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { Skeleton } from '@/components/ui/skeleton';
import IdUserCard from '@/components/user/id-user-card';

import localeToFlag from '@/constant/constant';
import useClientApi from '@/hooks/use-client';
import { getServerPlayers } from '@/query/server';
import { Player } from '@/types/response/Player';

import { useSuspenseQuery } from '@tanstack/react-query';

type PlayerListProps = {
	id: string;
};

export function PlayerList({ id }: PlayerListProps) {
	const axios = useClientApi();
	const { data, isError, error } = useSuspenseQuery({
		queryKey: ['server', id, 'player'],
		queryFn: () => getServerPlayers(axios, id),
	});

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return (
		<div className="grid gap-4 min-w-[300px]">
			{data
				?.sort((a, b) => a.team.name.localeCompare(b.team.name))
				.map((player) => <PlayerCard key={player.uuid} serverId={id} player={player} />)}
		</div>
	);
}

type PlayerListSkeletonProps = {
	players: number;
};

export function PlayerListSkeleton({ players }: PlayerListSkeletonProps) {
	if (players === 0) {
		return undefined;
	}

	return Array(players)
		.fill(1)
		.map((_, index) => <Skeleton className="h-10 w-full" key={index} />);
}

type PlayerCardProps = {
	serverId: string;
	player: Player;
};

function getCountryCode(locale: string): string {
	const parts = locale.split('_');
	return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase();
}

function PlayerCard({ serverId, player: { locale, userId, name, team, ip, uuid } }: PlayerCardProps) {
	locale = getCountryCode(locale ?? 'EN');

	return (
		<div className="flex flex-col justify-between gap-1 px-4 py-1 hover:bg-secondary">
			<div className="flex text-lg justify-between gap-1 items-center">
				<ColorText className="font-semibold" text={name} />
				<div className="flex gap-1 items-center">
					{locale && (localeToFlag[locale] ?? locale)}
					{userId && <IdUserCard id={userId} />}
					<EllipsisButton variant="ghost">
						<BanButton id={serverId} uuid={uuid} username={name} ip={ip} />
						<KickButton id={serverId} username={name} />
					</EllipsisButton>
				</div>
			</div>
			<div className="border-b-4" style={{ borderColor: `#${team.color}` }} />
		</div>
	);
}
