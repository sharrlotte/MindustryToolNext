import { WifiIcon } from 'lucide-react';
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
					<Tran text="server.not-response" asChild />
				</Badge>
			);
		}

		if (status === 'DOWN') {
			return (
				<Badge variant="destructive">
					<WifiIcon size={20} />
					<Tran text="server.offline" asChild />
				</Badge>
			);
		}

		return <Badge variant="destructive">{status}</Badge>;
	}

	return <div>{render()}</div>;
}
