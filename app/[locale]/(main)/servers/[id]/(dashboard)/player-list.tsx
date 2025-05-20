'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

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
import Divider from '@/components/ui/divider';
import Tran from '@/components/common/tran';

type PlayerListProps = {
	id: string;
};

export default function PlayerList({ id }: PlayerListProps) {
	const axios = useClientApi();
	const { data, isError, error } = useSuspenseQuery({
		queryKey: ['server', id, 'player'],
		queryFn: () => getServerPlayers(axios, id),
		refetchInterval: 10000,
	});

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return (
		<AnimatePresence>
			<h3>
				<Tran text="server.player-list" />
			</h3>
			<Divider />
			{data
				?.sort((a, b) => a.name.localeCompare(b.name))
				?.sort((a, b) => (a.locale ?? 'EN').localeCompare(b.locale ?? 'EN'))
				?.sort((a, b) => a.team.name.localeCompare(b.team.name))
				.map((player) => <PlayerCard key={player.uuid} serverId={id} player={player} />)}
		</AnimatePresence>
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

function PlayerCard({ serverId, player: { locale, userId, name, team, ip, uuid, isAdmin, joinedAt } }: PlayerCardProps) {
	locale = getCountryCode(locale ?? 'EN');

	return (
		<motion.div
			exit={{
				x: 1000, // move far right
				y: -300, // and up
				rotate: 720, // spin
				opacity: 0, // fade out
				scale: 0.5, // shrink
				transition: {
					duration: 1,
					ease: 'easeOut',
				},
			}}
			className="flex items-center gap-2 bg-secondary rounded-md overflow-hidden px-2 py-1"
		>
			<div className="rounded-full size-2" style={{ backgroundColor: `#${team.color}` }} />
			<div className="flex justify-between gap-1 items-center w-full">
				<div className="flex flex-col gap-2">
					<span className="flex items-center justify-center gap-1">
						<span>{locale && (localeToFlag[locale] ?? locale)}</span>
						{userId && <IdUserCard id={userId} />}
						{isAdmin && ''}
						(<ColorText className="font-semibold" text={name} />)
					</span>
				</div>
				<div className="flex gap-1 items-center">
					<TimeFrom time={joinedAt} />
					<EllipsisButton variant="ghost">
						<BanButton id={serverId} uuid={uuid} username={name} ip={ip} />
						<KickButton id={serverId} uuid={uuid} />
					</EllipsisButton>
				</div>
			</div>
		</motion.div>
	);
}

function TimeFrom({ time }: { time: number }) {
	const [relative, setRelative] = useState('');

	useInterval(() => {
		const now = Date.now();
		const diff = now - time;
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) {
			setRelative(`${days}d${hours % 24}h${minutes % 60}m`);
		} else if (hours > 0) {
			setRelative(`${hours}h${minutes % 60}m`);
		} else if (minutes > 0) {
			setRelative(`${minutes}m${seconds % 60}s`);
		} else if (seconds > 0) {
			setRelative(`${seconds}s`);
		}
	}, 1000);

	return <span>{relative}</span>;
}
