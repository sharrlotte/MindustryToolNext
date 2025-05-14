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

export default function PlayerList({ id }: PlayerListProps) {
	const axios = useClientApi();
	const { data, isError, error } = useSuspenseQuery({
		queryKey: ['server', id, 'player'],
		queryFn: () => getServerPlayers(axios, id),
	});

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return data
		?.sort((a, b) => a.name.localeCompare(b.name))
		?.sort((a, b) => (a.locale ?? 'EN').localeCompare(b.locale ?? 'EN'))
		?.sort((a, b) => a.team.name.localeCompare(b.team.name))
		.map((player) => <PlayerCard key={player.uuid} serverId={id} player={player} />);
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
		<div className="flex items-center gap-2 bg-secondary rounded-md overflow-hidden px-2 py-1">
			<div className="rounded-full size-2" style={{ backgroundColor: `#${team.color}` }} />
			<div className="flex justify-between gap-1 items-center w-full">
				<div className="flex flex-col gap-2">
					<span className="flex items-center justify-center gap-1">
						<span>{locale && (localeToFlag[locale] ?? locale)}</span>
						<ColorText className="font-semibold" text={name} />
					</span>
					{userId && <IdUserCard id={userId} />}
				</div>
				<div className="flex gap-1 items-center">
					<EllipsisButton variant="ghost">
						<BanButton id={serverId} uuid={uuid} username={name} ip={ip} />
						<KickButton id={serverId} uuid={uuid} />
					</EllipsisButton>
				</div>
			</div>
		</div>
	);
}
