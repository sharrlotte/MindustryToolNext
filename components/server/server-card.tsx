import Image from 'next/image';
import React, { Fragment, Suspense } from 'react';

import ColorText from '@/components/common/color-text';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import ServerStatusBadge from '@/components/server/server-status-badge';

import { cn } from '@/lib/utils';
import { ServerDto } from '@/types/response/ServerDto';

type MyServerInstancesCardProps = {
	server: ServerDto;
};

export default function ServerCard({
	server: { id, name, players, port, status, mapName, mode, gamemode, isOfficial, avatar },
}: MyServerInstancesCardProps) {
	return (
		<InternalLink
			className="flex flex-1 cursor-pointer flex-col gap-2 rounded-md bg-card p-4 h-60 relative border"
			href={`/servers/${id}`}
		>
			<Suspense>
				<div className="flex items-start gap-2 flex-nowrap w-full overflow-hidden text-ellipsis justify-between">
					<div className="flex gap-2 items-center">
						{avatar && <Image className="size-8 object-cover rounded-md" src={avatar} width={32} height={32} alt={name} />}
						<ColorText className="text-2xl font-bold" text={name} />
					</div>
					{isOfficial && (
						<span className="rounded-xl text-nowrap bg-purple-500 text-white text-xs px-2 py-1">
							<Tran text="server.official" />
						</span>
					)}
				</div>
				<div
					className={cn('grid grid-cols-2 w-full gap-3 text-sm font-medium capitalize text-muted-foreground', {
						'text-foreground': status === 'HOST',
					})}
				>
					<div className="flex flex-col gap-0.5">
						<Tran asChild text="server.status" />
						<ServerStatusBadge status={status} />
					</div>
					<div className="flex flex-col gap-0.5">
						<Tran asChild text="server.game-mode" />
						<span>
							<span>{mode}</span>
							{gamemode && '/'}
							{gamemode && <span>{gamemode}</span>}
						</span>
					</div>
					<div className="flex flex-col gap-0.5">
						<Tran asChild text="server.players" />
						<span>{players}/30</span>
					</div>
					<div className="flex flex-col gap-0.5">
						{port > 0 && (
							<Fragment>
								<Tran asChild text="server.port" />
								<span>{port}</span>
							</Fragment>
						)}
					</div>
					<div className="flex flex-col gap-0.5 text-nowrap">
						{mapName && (
							<Fragment>
								<Tran asChild text="server.map" />
								<ColorText text={mapName} />
							</Fragment>
						)}
					</div>
				</div>
			</Suspense>
		</InternalLink>
	);
}
