'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

import ErrorMessage from '@/components/common/error-message';
import { Visibility, VisibilityOff, VisibilityOn } from '@/components/common/visibility';
import { Skeleton } from '@/components/ui/skeleton';
import Skeletons from '@/components/ui/skeletons';

import useClientApi from '@/hooks/use-client';
import { getServerKicks } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

type KickListProps = {
	id: string;
	kicks: number;
};

export default function KickList({ id, kicks }: KickListProps) {
	const axios = useClientApi();
	const [currentTime, setCurrentTime] = useState(Date.now());

	useInterval(() => setCurrentTime(Date.now()), 1000);

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['server', id, 'kick'],
		queryFn: () => getServerKicks(axios, id),
	});

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	if (isLoading) {
		return (
			<Skeletons number={kicks}>
				<Skeleton className="w-full h-10 rounded-md" />
			</Skeletons>
		);
	}

	return (
		<AnimatePresence>
			{Object.entries(data ?? {}) //
				.map(([ip, untilTime]) => (
					<KickCard key={ip} serverId={id} kick={{ ip, untilTime }} currentTime={currentTime} />
				))}
		</AnimatePresence>
	);
}

type KickListSkeletonProps = {
	kicks: number;
};

export function KickListSkeleton({ kicks }: KickListSkeletonProps) {
	if (kicks === 0) {
		return undefined;
	}

	return Array(kicks)
		.fill(1)
		.map((_, index) => <Skeleton className="h-10 w-full" key={index} />);
}

type KickCardProps = {
	serverId: string;
	currentTime: number;
	kick: {
		ip: string;
		untilTime: number;
	};
};

function KickCard({ currentTime, kick: { ip, untilTime } }: KickCardProps) {
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
			layout="position"
			className="flex items-center justify-between gap-2 bg-secondary rounded-md overflow-hidden px-2 py-1 h-10"
		>
			<Visibility>
				<VisibilityOff>
					<span>{ip.replace(/\d/g, '*')}</span>
				</VisibilityOff>
				<VisibilityOn>
					<span>{ip}</span>
				</VisibilityOn>
			</Visibility>
			<TimeFrom time={untilTime} currentTime={currentTime} />
		</motion.div>
	);
}

function TimeFrom({ time, currentTime }: { time: number; currentTime: number }) {
	let relative = '';

	const now = currentTime;
	const diff = time - now;
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		relative = `${days}d${hours % 24}h${minutes % 60}m`;
	} else if (hours > 0) {
		relative = `${hours}h${minutes % 60}m`;
	} else if (minutes > 0) {
		relative = `${minutes}m${seconds % 60}s`;
	} else if (seconds > 0) {
		relative = `${seconds}s`;
	} else {
		relative = `Expired`;
	}

	return <span>{relative}</span>;
}
