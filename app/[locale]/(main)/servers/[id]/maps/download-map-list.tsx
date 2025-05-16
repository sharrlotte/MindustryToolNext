import { useParams } from 'next/navigation';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import LoadingSpinner from '@/components/common/loading-spinner';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import { PreviewImage } from '@/components/common/preview';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import NameTagSearch from '@/components/search/name-tag-search';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';

import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useServerMaps from '@/hooks/use-server-maps';
import { cn } from '@/lib/utils';
import { getMapCount, getMaps } from '@/query/map';
import { createServerMap } from '@/query/server';
import { Map } from '@/types/response/Map';
import { ItemPaginationQuery } from '@/types/schema/search-query';

import { useMutation } from '@tanstack/react-query';

export default function DownloadMapList() {
	return (
		<div className="flex h-full flex-col gap-2 overflow-hidden">
			<NameTagSearch type="map" />
			<ScrollContainer className="flex h-full w-full flex-col gap-2">
				<ListLayout>
					<InfinitePage
						paramSchema={ItemPaginationQuery}
						queryKey={['map']}
						queryFn={(axios, params) => getMaps(axios, params)}
						skeleton={{
							amount: 20,
							item: <Skeleton className="h-20" />,
						}}
					>
						{(page) => page.map((map) => <AddServerMapCard key={map.id} map={map} />)}
					</InfinitePage>
				</ListLayout>
				<GridLayout>
					<GridPaginationList
						paramSchema={ItemPaginationQuery}
						queryKey={['map']}
						queryFn={getMaps}
						skeleton={{
							amount: 20,
							item: <Skeleton className="h-20" />,
						}}
					>
						{(page) => page.map((map) => <AddServerMapCard key={map.id} map={map} />)}
					</GridPaginationList>
				</GridLayout>
			</ScrollContainer>
			<div className="flex justify-end gap-2 mt-auto">
				<PaginationLayoutSwitcher />
				<GridLayout>
					<PaginationNavigator numberOfItems={getMapCount} queryKey={['maps', 'total']} />
				</GridLayout>
			</div>
		</div>
	);
}

type AddServerMapCardProps = {
	map: Map;
};

function AddServerMapCard({ map }: AddServerMapCardProps) {
	const { name } = map;

	const { id } = useParams() as { id: string };
	const axios = useClientApi();
	const maps = useServerMaps(id);
	const added = maps.data ?? [];

	const isAdded = added.some((add) => add.filename.startsWith(map.id));

	const { invalidateByKey } = useQueriesData();

	const { mutate, isPending } = useMutation({
		mutationKey: ['server', id, 'map', 'add', map.id],
		mutationFn: (mapId: string) => createServerMap(axios, id, { mapId }),
		onSuccess: () => {
			toast.success(<Tran text="server.add-map-success" />);
		},
		onError: (error) => {
			toast.error(<Tran text="server.add-map-fail" />, { error });
		},
		onSettled: () => {
			invalidateByKey(['server', id, 'map']);
		},
	});

	return (
		<button
			className={cn(
				'hover:zoom-in-110 relative h-full max-h-preview-height min-h-preview-height w-full overflow-hidden rounded-md border-2 border-border p-0 text-start',
				{
					'border-success': isAdded,
				},
			)}
			disabled={isPending || isAdded}
			onClick={() => mutate(map.id)}
		>
			<h3 className="absolute top-0 w-full overflow-hidden p-2 text-center backdrop-brightness-[20%]">{name}</h3>
			<PreviewImage
				className="h-full"
				src={`${env.url.image}/map-previews/${map.id}${env.imageFormat}`}
				errorSrc={`${env.url.image}/map-previews/${map.id}${env.imageFormat}`}
				alt={name}
			/>
			{isPending && (
				<div className="absolute inset-0 z-10 backdrop-brightness-50 flex items-center justify-center">
					<LoadingSpinner className="m-auto" />
				</div>
			)}
		</button>
	);
}
