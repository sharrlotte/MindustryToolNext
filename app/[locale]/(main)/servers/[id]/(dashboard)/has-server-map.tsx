import { ReactNode } from 'react';

import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';

import useServerMaps from '@/hooks/use-server-maps';

export default function HasServerMap({ id, children }: { id: string; children: ReactNode }) {
	const { data, isError, isLoading } = useServerMaps(id);

	if (isLoading) {
		return <></>;
	}

	if (isError || !data || data.length === 0) {
		return (
			<div className="px-2 py-1 space-x-2 h-9 rounded-md">
				<Tran className="text-warning" text="server.no-map-warning" />
				<InternalLink className="underline text-brand" href={`/servers/${id}/maps?tab=download`}>
					<Tran text="internal-server.add-map" />
				</InternalLink>
			</div>
		);
	}

	return children;
}
