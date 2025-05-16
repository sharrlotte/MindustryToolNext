import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

import ColorText from '@/components/common/color-text';
import FallbackImage from '@/components/common/fallback-image';
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

import { GITHUB_PATTERN } from '@/constant/constant';
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
	const { id } = useParams() as { id: string };
	const plugins = useServerPlugins(id);
	const added = plugins.data ?? [];

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
							item: <Skeleton className="h-40 min-h-40" />,
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
							item: <Skeleton className="h-40 min-h-40" />,
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
	const { name, description, url } = plugin;

	const { id } = useParams() as { id: string };
	const plugins = useServerPlugins(id);
	const added = plugins.data ?? [];
	const axios = useClientApi();

	const currentPlugin = added.find((a) => a.filename.startsWith(plugin.id + '_' + new Date(plugin.lastReleaseAt).getTime()));
	let installedVersion = undefined;
	const newestVersion = new Date(plugin.lastReleaseAt);

	if (currentPlugin) {
		installedVersion = new Date(Number(currentPlugin.filename.replace('.jar', '').split('_').at(-1) as string));
	}

	const { invalidateByKey } = useQueriesData();

	const { mutate, isPending } = useMutation({
		mutationKey: ['server', id, 'plugin', plugin.id],
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

	const matches = GITHUB_PATTERN.exec(url);
	const user = matches?.at(1);
	const repo = matches?.at(2);

	return (
		<motion.button
			className="relative border flex h-40 min-h-40 w-full flex-col items-start justify-start gap-2 overflow-hidden rounded-md bg-card p-4 text-start hover:border-brand cursor-pointer"
			disabled={isPending}
			onClick={() => mutate(plugin.id)}
			layout
		>
			<h2 className="line-clamp-1 w-full text-ellipsis whitespace-normal text-nowrap flex gap-1 items-center">
				<FallbackImage
					width={20}
					height={20}
					className="size-5 rounded-sm overflow-hidden"
					src={`https://raw.githubusercontent.com/${user}/${repo}/master/icon.png`}
					errorSrc="https://raw.githubusercontent.com/Anuken/Mindustry/master/core/assets/sprites/error.png"
					alt={''}
				/>
				{name}
			</h2>
			<p className="line-clamp-2 w-full overflow-hidden text-ellipsis text-wrap text-muted-foreground">
				<ColorText text={description} />
			</p>
			{!!installedVersion && installedVersion.getTime() !== newestVersion.getTime() && (
				<div className="flex items-center">
					{installedVersion && (
						<>
							<span className="text-sm text-destructive-foreground">{installedVersion.toLocaleString()}</span>
							{'=>'}
						</>
					)}
					<span
						className={cn('text-sm', {
							'text-success-foreground': !!installedVersion,
						})}
					>
						{newestVersion.toLocaleString()}
					</span>
				</div>
			)}
			{isPending && (
				<div className="absolute inset-0 z-10 backdrop-brightness-50 flex items-center justify-center">
					<LoadingSpinner className="m-auto" />
				</div>
			)}
		</motion.button>
	);
}
