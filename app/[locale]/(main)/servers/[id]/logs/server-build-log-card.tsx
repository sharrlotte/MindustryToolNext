'use client';

import ColorText from '@/components/common/color-text';
import { RelativeTime } from '@/components/common/relative-time';
import { Visibility, VisibilityOff, VisibilityOn } from '@/components/common/visibility';
import { BanButton } from '@/components/server/ban.button';
import { KickButton } from '@/components/server/kick.button';
import { EllipsisButton } from '@/components/ui/ellipsis-button';

import { cn } from '@/lib/utils';
import { ServerBuildLog } from '@/types/response/ServerBuildLog';

type ServerBuildLogCardProps = {
	data: {
		player: ServerBuildLog['player'];
		events: {
			building: ServerBuildLog['building'];
			message: ServerBuildLog['message'];
			createdAt: ServerBuildLog['createdAt'];
		}[];
	};
	index: number;
	serverId: string;
};

export default function ServerBuildLogCard({ serverId, data: { player, events }, index }: ServerBuildLogCardProps) {
	const { name, uuid } = player;

	return (
		<div className={cn('p-2 grid gap-2 rounded-lg border text-sm', index % 2 === 0 ? 'bg-card/50' : 'bg-card')}>
			<div className="flex justify-between gap-2 flex-wrap">
				<div className="flex gap-2 group flex-col">
					<div className="flex gap-2">
						<span>
							<span className="font-semibold">Name: </span>
							<ColorText text={player.name} />
						</span>
						<span>
							<span className="font-semibold">Team: </span>
							<span>{player.team.name}</span>
						</span>
					</div>
					<div className="flex gap-2">
						<span className="font-semibold">UUID:</span>
						<Visibility>
							<VisibilityOn>{uuid}</VisibilityOn>
							<VisibilityOff>{'*'.repeat(27)}</VisibilityOff>
						</Visibility>
					</div>
				</div>
				<div className="flex items-start">
					<EllipsisButton variant="ghost">
						<KickButton id={serverId} uuid={uuid} />
						<BanButton id={serverId} username={name} uuid={uuid} />
					</EllipsisButton>
				</div>
			</div>
			<div className="flex gap-2 flex-col text-muted-foreground">
				{events.map(({ building, message, createdAt }, index) => (
					<div className="grid gap-1 px-2 py-1 bg-secondary rounded-md overflow-hidden" key={index}>
						<div>Event: {message}</div>
						<div>Block: {building.name}</div>
						<div className="space-x-2">
							<span>x: {building.x}</span>
							<span>y: {building.y}</span>
						</div>
						<div className="space-x-2">
							<span>Last access: {building.lastAccess}</span>
							<span>
								Time: <RelativeTime date={new Date(createdAt)} className="text-sm text-muted-foreground" />{' '}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
