import React, { Fragment, Suspense } from 'react';

import ColorText from '@/components/common/color-text';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import ServerStatus from '@/components/server/server-status';

import { cn } from '@/lib/utils';
import { ServerDto } from '@/types/response/ServerDto';

type MyServerInstancesCardProps = {
	server: ServerDto;
};

export default function ServerCard({
	server: { id, name, players, port, status, mapName, mode, isOfficial },
}: MyServerInstancesCardProps) {
	return (
		<InternalLink
			className="flex flex-1 cursor-pointer flex-col gap-2 rounded-md bg-card p-4 h-60 relative"
			href={`/servers/${id}`}
		>
			<Suspense>
				<div className="flex items-start gap-2 flex-nowrap w-full overflow-hidden text-ellipsis justify-between">
					<ColorText className="text-2xl font-bold" text={name} />
					{isOfficial && (
						<span className="rounded-xl text-nowrap bg-brand text-brand-foreground text-xs px-2 py-1">
							<Tran text="server.official" />
						</span>
					)}
				</div>
				<div
					className={cn('grid grid-cols-2 gap-3 text-sm font-medium capitalize text-muted-foreground', {
						'text-foreground': status === 'HOST',
					})}
				>
					<div className="flex flex-col gap-0.5">
						<Tran asChild text="server.status" />
						<ServerStatus status={status} />
					</div>
					<div className="flex flex-col gap-0.5">
						<Tran asChild text="server.game-mode" />
						<span className="capitalize">{mode.toLocaleLowerCase()}</span>
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
					<div className="flex flex-col gap-0.5">
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
