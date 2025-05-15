import { useParams } from 'next/navigation';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import LoadingSpinner from '@/components/common/loading-spinner';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import NameTagSearch from '@/components/search/name-tag-search';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useServerPlugins from '@/hooks/use-server-plugins';
import { cn } from '@/lib/utils';
import { getPluginCount, getPlugins } from '@/query/plugin';
import { createServerPlugin } from '@/query/server';
import { Plugin } from '@/types/response/Plugin';
import { ItemPaginationQuery } from '@/types/schema/search-query';

import { useMutation } from '@tanstack/react-query';

export default function DownloadPluginList() {
	return (
		<div className="flex h-full flex-col gap-2 overflow-hidden">
			<NameTagSearch type="plugin" />
			<ScrollContainer className="flex h-full w-full flex-col gap-2">
				<ListLayout>
					<InfinitePage
						paramSchema={ItemPaginationQuery}
						queryKey={['plugin']}
						queryFn={(axios, params) => getPlugins(axios, params)}
						skeleton={{
							amount: 20,
							item: <Skeleton className="h-20" />,
						}}
					>
						{(page) => page.map((plugin) => <AddServerPluginCard key={plugin.id} plugin={plugin} />)}
					</InfinitePage>
				</ListLayout>
				<GridLayout>
					<GridPaginationList
						paramSchema={ItemPaginationQuery}
						queryKey={['plugin']}
						queryFn={getPlugins}
						skeleton={{
							amount: 20,
							item: <Skeleton className="h-20" />,
						}}
					>
						{(page) => page.map((plugin) => <AddServerPluginCard key={plugin.id} plugin={plugin} />)}
					</GridPaginationList>
				</GridLayout>
			</ScrollContainer>
			<div className="flex justify-end gap-2 mt-auto">
				<PaginationLayoutSwitcher />
				<GridLayout>
					<PaginationNavigator numberOfItems={getPluginCount} queryKey={['plugins', 'total']} />
				</GridLayout>
			</div>
		</div>
	);
}

type AddServerPluginCardProps = {
	plugin: Plugin;
};

function AddServerPluginCard({ plugin }: AddServerPluginCardProps) {
	const { name, description } = plugin;

	const { id } = useParams() as { id: string };
	const axios = useClientApi();
	const plugins = useServerPlugins(id);
	const added = plugins.data ?? [];

	const isAdded = added.some((add) => add.filename.startsWith(plugin.id));

	const { invalidateByKey } = useQueriesData();

	const { mutate, isPending } = useMutation({
		mutationKey: ['server', id, 'plugin', 'add', plugin.id],
		mutationFn: (pluginId: string) => createServerPlugin(axios, id, { pluginId }),
		onSuccess: () => {
			toast.success(<Tran text="server.add-plugin-success" />);
		},
		onError: (error) => {
			toast.error(<Tran text="server.add-plugin-fail" />, { error });
		},
		onSettled: () => {
			invalidateByKey(['server', id, 'plugin']);
		},
	});

	return (
		<button
			className={cn(
				'relative border flex h-32 w-full flex-col items-start justify-start gap-2 overflow-hidden rounded-md bg-card p-4 text-start hover:bg-brand/70 cursor-pointer',
				{
					'border-success': isAdded,
				},
			)}
			disabled={isPending || isAdded}
			onClick={() => mutate(plugin.id)}
		>
			<h2 className="line-clamp-1 w-full text-ellipsis whitespace-normal text-nowrap">{name}</h2>
			<span className="line-clamp-2 w-full overflow-hidden text-ellipsis text-wrap text-muted-foreground">{description}</span>
			{isPending && (
				<div className="absolute inset-0 z-10 backdrop-brightness-50 flex items-center justify-center">
					<LoadingSpinner className="m-auto" />
				</div>
			)}
		</button>
	);
}
