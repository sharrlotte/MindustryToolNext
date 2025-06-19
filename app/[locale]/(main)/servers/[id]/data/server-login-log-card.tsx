'use client';

import ColorText from '@/components/common/color-text';
import { RelativeTime } from '@/components/common/relative-time';
import { Visibility, VisibilityOff, VisibilityOn } from '@/components/common/visibility';
import { BanButton } from '@/components/server/ban.button';
import { KickButton } from '@/components/server/kick.button';
import { EllipsisButton } from '@/components/ui/ellipsis-button';

import { cn } from '@/lib/utils';
import { ServerLoginLog } from '@/types/response/ServerLoginLog';

type ServerLoginLogCardProps = {
	data: ServerLoginLog;
	index: number;
	serverId: string;
};

export default function ServerLoginLogCard({ serverId, data: { name, uuid, ip, createdAt }, index }: ServerLoginLogCardProps) {
	return (
		<div className={cn('justify-between gap-2 text-sm flex border rounded-md', index % 2 === 0 ? 'bg-card/50' : 'bg-card')}>
			<div className="grid-cols-1 grid p-2 gap-2 w-full">
				<span>
					<span className="font-semibold">Name: </span>
					<ColorText text={name} />
				</span>
				<div className="flex items-center gap-2 group">
					<span className="font-semibold">UUID: </span>
					<Visibility>
						<VisibilityOff>
							<span>{'*'.repeat(27)}</span>
						</VisibilityOff>
						<VisibilityOn>
							<span>{uuid}</span>
						</VisibilityOn>
					</Visibility>
				</div>
				<div className="flex items-center gap-2 group">
					<span className="font-semibold">IP: </span>
					<Visibility>
						<VisibilityOff>
							<span>{ip.replaceAll(/\d/g, '*')}</span>
						</VisibilityOff>
						<VisibilityOn>
							<span>{ip}</span>
						</VisibilityOn>
					</Visibility>
				</div>
				<RelativeTime date={new Date(createdAt)} />
			</div>
			<EllipsisButton variant="ghost">
				<KickButton id={serverId} uuid={uuid} />
				<BanButton id={serverId} ip={ip} username={name} uuid={uuid} />
			</EllipsisButton>
		</div>
	);
}
