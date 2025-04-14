import React from 'react';

import ErrorScreen from '@/components/common/error-screen';
import InternalLink from '@/components/common/internal-link';

import { serverApi } from '@/action/common';
import { isError } from '@/lib/error';
import { getMyServerManager } from '@/query/server';

export default async function Page() {
	const managers = await serverApi((axios) => getMyServerManager(axios));

	if (isError(managers)) {
		return <ErrorScreen error={managers} />;
	}

	return (
		<div className="p-2 space-y-4">
			<h1>Server Managers</h1>
			<ul className="flex">
				{managers.map((manager) => (
					<InternalLink className="bg-card p-4 rounded-lg grid" key={manager.id} href={`server-managers/${manager.id}`}>
						<div>{manager.name}</div>
						<div className="text-sm text-muted-foreground">{manager.address}</div>
						<div className="text-sm text-muted-foreground">{manager.status}</div>
					</InternalLink>
				))}
			</ul>
		</div>
	);
}
