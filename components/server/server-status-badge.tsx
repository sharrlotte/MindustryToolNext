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
				<Badge variant="warning">
					<AlertTriangleIcon size={20} />
					<Tran text="server.stopped" asChild />
				</Badge>
			);
		}

		if (status === 'HOST') {
			return (
				<Badge variant="success">
					<WifiIcon size={20} />
					<Tran text="server.online" asChild />
				</Badge>
			);
		}

		if (status === 'DELETED') {
			return (
				<Badge variant="destructive">
					<Tran text="server.deleted" asChild />
				</Badge>
			);
		}

		if (status === 'NOT_RESPONSE') {
			return (
				<Badge variant="destructive">
					<ClockIcon size={20} />
					<Tran text="server.not-response" asChild />
				</Badge>
			);
		}

		if (status === 'DOWN') {
			return (
				<Badge variant="destructive">
					<WifiOff size={20} />
					<Tran text="server.offline" asChild />
				</Badge>
			);
		}

		return (
			<Badge variant="destructive">
				<AlertTriangleIcon size={20} />
				<span>{status}</span>
			</Badge>
		);
	}

	return <div>{render()}</div>;
}
