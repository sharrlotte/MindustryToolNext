import React from 'react';

import ErrorScreen from '@/components/common/error-screen';
import InternalLink from '@/components/common/internal-link';
import Divider from '@/components/ui/divider';

import { serverApi } from '@/action/common';
import { isError } from '@/lib/error';
import { cn } from '@/lib/utils';
import { getMyServerManager } from '@/query/server-manager';
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
			<section className="grid gap-2 md:grid-cols-2">
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
			<div className="flex justify-between items-center">
				<span>{name}</span>
				<div
					className={cn(
						'w-fit text-xs px-3 py-0.5 rounded-full',
						status === 'UP' ? 'bg-success-foreground' : 'bg-destructive-foreground',
					)}
				>
					{status}
				</div>
			</div>
			<div className="text-sm text-muted-foreground">{address}</div>
		</InternalLink>
	);
}
