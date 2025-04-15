'use client';

import { useState } from 'react';

import ColorText from '@/components/common/color-text';
import { EyeIcon, EyeOffIcon } from '@/components/common/icons';
import { RelativeTime } from '@/components/common/relative-time';
import { BanButton } from '@/components/server/ban.button';
import { KickButton } from '@/components/server/kick.button';
import { EllipsisButton } from '@/components/ui/ellipsis-button';

import { cn } from '@/lib/utils';
import { ServerBuildLog } from '@/types/response/ServerBuildLog';

type ServerBuildLogCardProps = {
	data: ServerBuildLog;
	index: number;
	serverId: string;
};

export default function ServerBuildLogCard({ serverId, data: { message, createdAt, player, building }, index }: ServerBuildLogCardProps) {
	const [showUuid, setShowUuid] = useState(false);

	const { name, uuid } = player;

	return (
		<div className={cn('p-4 grid-cols-1 grid md:grid-cols-5 gap-2 rounded-lg transition-colors', index % 2 === 0 ? 'bg-card/50' : 'bg-card')}>
			<div className="flex-1 space-y-2">
				<span>{message}</span>

				<div className="grid gap-1">
					<div className="flex items-center gap-2 group">
						<div className="flex gap-1">
							<ColorText text={player.name} />
							<span>{player.team.name}</span>
						</div>
						<span className="text-muted-foreground">UUID:</span>
						<span className="font-mono">{showUuid ? uuid : '*'.repeat(27)}</span>
						<button className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setShowUuid((prev) => !prev)}>
							{showUuid ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
						</button>
					</div>
				</div>

				<div className="grid gap-1">
					<div>{building.name}</div>
					<span>x: {building.x}</span>
					<span>y: {building.y}</span>
					<span>y: {building.lastAccess}</span>
				</div>

				<div className="flex items-center gap-2">
					<RelativeTime date={new Date(createdAt)} className="text-sm text-muted-foreground" />
				</div>

				<div className="flex items-start">
					<EllipsisButton variant="ghost">
						<KickButton id={serverId} username={name} />
						<BanButton id={serverId} username={name} uuid={uuid} />
					</EllipsisButton>
				</div>
			</div>
		</div>
	);
}
