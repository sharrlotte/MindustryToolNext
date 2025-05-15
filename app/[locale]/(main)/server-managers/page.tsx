import React from 'react';

import ErrorScreen from '@/components/common/error-screen';
import InternalLink from '@/components/common/internal-link';
import Divider from '@/components/ui/divider';

import { serverApi } from '@/action/common';
import { isError } from '@/lib/error';
import { cn } from '@/lib/utils';
import { getMyServerManager } from '@/query/server';
import { ServerManager } from '@/types/response/ServerManager';

export default async function Page() {
	const managers = await serverApi((axios) => getMyServerManager(axios));

	if (isError(managers)) {
		return <ErrorScreen error={managers} />;
	}

	return (
		<div className="p-2 space-y-2">
			<h2>Server Managers</h2>
			<Divider />
			<section className="flex gap-2 flex-wrap">
				{managers.map((manager) => (
					<ManagerCard key={manager.id} manager={manager} />
				))}
			</section>
		</div>
	);
}

function ManagerCard({ manager }: { manager: ServerManager }) {
	const { id, name, address, status } = manager;
	return (
		<InternalLink className="bg-card p-2 border rounded-lg grid" key={id} href={`server-managers/${id}`}>
			<div>{name}</div>
			<div className="text-sm text-muted-foreground">{address}</div>
			<div className={cn('text-sm text-muted-foreground')}>{status}</div>
		</InternalLink>
	);
}
