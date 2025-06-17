import { AlertTriangleIcon, ClockIcon, WifiIcon, WifiOff } from 'lucide-react';
import React from 'react';

import Tran from '@/components/common/tran';
import { Badge } from '@/components/ui/badge';

import { type ServerStatus } from '@/constant/constant';

type Props = {
	status: ServerStatus;
};

export default function ServerStatusBadge({ status }: Props) {
	function render() {
		if (status === 'UP') {
			return (
				<Badge className="gap-1" variant="warning">
					<AlertTriangleIcon size={16} />
					<Tran text="server.stopped" />
				</Badge>
			);
		}

		if (status === 'HOST') {
			return (
				<Badge className="gap-1" variant="success">
					<WifiIcon size={16} />
					<Tran text="server.online" />
				</Badge>
			);
		}

		if (status === 'DELETED') {
			return (
				<Badge className="gap-1" variant="destructive">
					<Tran text="server.deleted" />
				</Badge>
			);
		}

		if (status === 'NOT_RESPONSE') {
			return (
				<Badge className="gap-1" variant="destructive">
					<ClockIcon size={16} />
					<Tran text="server.not-response" />
				</Badge>
			);
		}

		if (status === 'DOWN') {
			return (
				<Badge className="gap-1" variant="destructive">
					<WifiOff size={16} />
					<Tran text="server.offline" />
				</Badge>
			);
		}

		return (
			<Badge className="gap-1" variant="destructive">
				<AlertTriangleIcon size={16} />
				<span>{status}</span>
			</Badge>
		);
	}

	return <div>{render()}</div>;
}
