'use client';

import PlayerConnectRoomCard from '@/app/[locale]/(main)/servers/player-connect-room-card';

import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import ServerCardSkeleton from '@/components/server/server-card.skeleton';

import { PaginationQuerySchema } from '@/types/schema/search-query';

import { getPlayerConnectRooms } from '@/query/server';

export default function PlayerConnectRoomList() {
	return (
		<ScrollContainer>
			<InfinitePage
				className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(250px,100%),1fr))] gap-2 p-2"
				queryKey={['server']}
				skeleton={{ item: <ServerCardSkeleton />, amount: 20 }}
				paramSchema={PaginationQuerySchema}
				queryFn={(axios, { page }) => getPlayerConnectRooms(axios, { page })}
			>
				{(page) => page.map((room) => <PlayerConnectRoomCard data={room} key={room.roomId} />)}
			</InfinitePage>
		</ScrollContainer>
	);
}
