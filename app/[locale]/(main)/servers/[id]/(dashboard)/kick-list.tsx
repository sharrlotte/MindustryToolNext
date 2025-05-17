'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

import ErrorMessage from '@/components/common/error-message';
import { Skeleton } from '@/components/ui/skeleton';

import useClientApi from '@/hooks/use-client';
import { getServerKicks } from '@/query/server';

import { useSuspenseQuery } from '@tanstack/react-query';

type KickListProps = {
	id: string;
};

export default function KickList({ id }: KickListProps) {
	const axios = useClientApi();
	const { data, isError, error } = useSuspenseQuery({
		queryKey: ['server', id, 'kick'],
		queryFn: () => getServerKicks(axios, id),
	});

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return (
		<AnimatePresence>
			{Object.entries(data) //
				.map(([ip, untilTime]) => (
					<KickCard key={ip} serverId={id} kick={{ ip, untilTime }} />
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
	kick: {
		ip: string;
		untilTime: number;
	};
};

function KickCard({ kick: { ip, untilTime } }: KickCardProps) {
	return (
		<motion.div
			exit={{
				translateX: '-200%',
			}}
			className="flex items-center justify-between gap-2 bg-secondary rounded-md overflow-hidden px-2 py-1 h-10"
		>
			<span>{ip}</span>
			<TimeFrom time={untilTime} />
		</motion.div>
	);
}

function TimeFrom({ time }: { time: number }) {
	const [relative, setRelative] = useState('');

	useInterval(() => {
		const now = Date.now();
		const diff = time - now;
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
		} else {
			setRelative('0s');
		}
	}, 1000);

	return <span>{relative}</span>;
}
