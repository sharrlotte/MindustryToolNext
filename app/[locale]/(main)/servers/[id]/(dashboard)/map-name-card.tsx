import { Fragment } from 'react';

import ColorText from '@/components/common/color-text';
import Tran from '@/components/common/tran';
import { Skeleton } from '@/components/ui/skeleton';

import useServerStats from '@/hooks/useServerStats';

type MapNameProps = {
	id: string;
};
export default function MapName({ id }: MapNameProps) {
	const { data, isLoading } = useServerStats(id);

	return (
		<div className="flex flex-col gap-0.5">
			{data?.mapName && (
				<Fragment>
					<Tran text="server.map" />
					{isLoading || !data?.mapName ? <Skeleton className="h-5 w-24" /> : <ColorText text={data.mapName} />}
				</Fragment>
			)}
		</div>
	);
}
