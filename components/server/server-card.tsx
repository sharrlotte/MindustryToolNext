import { GlobeIcon, MapIcon, PlayIcon, UsersIcon } from 'lucide-react';
import React, { Fragment, Suspense } from 'react';

import ColorText from '@/components/common/color-text';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import ServerStatusBadge from '@/components/server/server-status-badge';
import ServerVersion from '@/components/server/server-version';

import { cn } from '@/lib/utils';
import { ServerDto } from '@/types/response/ServerDto';

import Image from 'next/image';

type ServerCardProps = {
	server: ServerDto;
};

export default function ServerCard({
	server: { id, name, players, port, status, mapName, mode, gamemode, isOfficial, avatar, version },
}: ServerCardProps) {
	return (
		<InternalLink
			className="flex flex-1 cursor-pointer flex-col gap-2 rounded-md bg-card p-4 h-72 relative border"
			href={`/servers/${id}`}
		>
			<Suspense>
				<div className="flex items-center gap-2 flex-nowrap w-full overflow-hidden text-ellipsis justify-between">
					<div className="flex gap-2 items-center">
						{avatar && <Image className="size-8 object-cover rounded-md" src={avatar} width={32} height={32} alt={name} />}
						<ColorText className="text-xl font-bold" text={name} />
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
						<Tran text="server.status" />
						<ServerStatusBadge status={status} />
					</div>
					<div className="flex flex-col gap-0.5">
						<span className="flex gap-1">
							<PlayIcon size={16} />
							<Tran text="server.game-mode" />
						</span>
						<span className="font-semibold">
							<span className="capitalize">{mode.toLowerCase()}</span>
							{gamemode && '/'}
							{gamemode && <span>{gamemode}</span>}
						</span>
					</div>
					<div className="flex flex-col gap-0.5">
						<span className="flex gap-1">
							<UsersIcon size={16} />
							<Tran text="server.players" />
						</span>
						<span className="font-semibold">{players}/30</span>
					</div>
					<div className="flex flex-col gap-0.5">
						{port > 0 && (
							<Fragment>
								<span className="flex gap-1">
									<GlobeIcon size={16} />
									<Tran text="server.port" />
								</span>
								<span className="font-semibold">{port}</span>
							</Fragment>
						)}
					</div>
					<div className="flex flex-col gap-0.5 text-nowrap">
						{mapName && (
							<Fragment>
								<span className="flex gap-1">
									<MapIcon size={16} />
									<Tran text="server.map" />
								</span>
								<ColorText className="font-semibold" text={mapName} />
							</Fragment>
						)}
					</div>
					{version && (status === 'HOST' || status === 'UP') && (
						<div className="flex flex-col gap-0.5 text-nowrap">
							<Fragment>
								<Tran text="server.version" />
								<ServerVersion>{version}</ServerVersion>
							</Fragment>
						</div>
					)}
				</div>
			</Suspense>
		</InternalLink>
	);
}
