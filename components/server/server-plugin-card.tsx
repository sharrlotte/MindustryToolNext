'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import DeleteButton from '@/components/button/delete.button';
import ColorText from '@/components/common/color-text';
import { DownloadIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { Batcher } from '@/lib/batcher';
import { dateToId, omit } from '@/lib/utils';
import { createServerPlugin, deleteServerPlugin } from '@/query/server';
import { ServerPlugin } from '@/types/response/ServerPlugin';

import { useMutation, useQuery } from '@tanstack/react-query';

type Props = {
	serverId: string;
	plugin: ServerPlugin;
};

export default function ServerPluginCard({ serverId, plugin: { name, filename, meta } }: Props) {
	const { invalidateByKey } = useQueriesData();

	const { description, version, author, repo } = meta;

	const parts = filename.replace('.jar', '').split('_');
	const isMindustryToolPlugin = parts.length === 2;

	const axios = useClientApi();
	const { mutate: deletePluginById, isPending: isDeleting } = useMutation({
		mutationFn: () => deleteServerPlugin(axios, serverId, filename),
		onSuccess: () => {
			toast.success(<Tran text="delete-success" />);
		},
		onError: (error) => {
			toast.error(<Tran text="delete-fail" />, { error });
		},
		onSettled: () => {
			invalidateByKey(['servers', serverId, 'plugins']);
			invalidateByKey(['server', serverId, 'plugin-version']);
		},
	});

	return (
		<div className="flex overflow-hidden relative flex-col gap-1 p-2 h-48 rounded-md border min-h-48 bg-card">
			<h2 className="overflow-hidden space-x-1 whitespace-normal line-clamp-1 text-ellipsis text-nowrap">
				{repo ? (
					<a href={`https://github.com/${repo}`}>
						<ColorText text={name} />
					</a>
				) : (
					<ColorText text={name} />
				)}
				<span className="text-base font-semibold">({version.startsWith('v') ? version : 'v' + version})</span>
			</h2>
			<span>{author}</span>
			<Popover>
				<PopoverTrigger>
					<p className="overflow-hidden text-left line-clamp-3 text-ellipsis text-secondary-foreground">
						<ColorText text={description} />
					</p>
				</PopoverTrigger>
				<PopoverContent className="md:w-96">
					<ScrollContainer className="max-h-[50vh] space-y-4">
						<ColorText text={description} />
						<div>
							{Object.entries(omit(meta, 'description')).map(([key, value]) => (
								<div key={key}>
									<span>{key}</span>: <span>{JSON.stringify(value)}</span>
								</div>
							))}
						</div>
					</ScrollContainer>
				</PopoverContent>
			</Popover>
			{isMindustryToolPlugin && (
				<div className="flex justify-end items-center w-full">
					<PluginVersion id={parts[0]} version={parts[1]} filename={filename} />
					<RedownloadPlugin id={parts[0]} />
					<DeleteButton
						variant="default"
						description={<Tran text="delete-alert" args={{ name }} />}
						isLoading={isDeleting}
						onClick={() => deletePluginById()}
					/>
				</div>
			)}
		</div>
	);
}

function RedownloadPlugin({ id }: { id: string }) {
	const { invalidateByKey } = useQueriesData();

	const axios = useClientApi();
	const { mutate, isPending } = useMutation({
		mutationKey: ['server', id, 'plugin', id],
		mutationFn: (pluginId: string) => createServerPlugin(axios, id, { pluginId }),
		onSuccess: () => {
			toast.success(<Tran text="server.add-plugin-success" />);
		},
		onError: (error) => {
			toast.error(<Tran text="server.add-plugin-fail" />, { error });
		},
		onSettled: () => {
			invalidateByKey(['server', id, 'plugin']);
			invalidateByKey(['server', id, 'plugin-version']);
		},
	});

	return (
		<Button variant="outline" disabled={isPending} onClick={() => mutate(id)}>
			<DownloadIcon />
		</Button>
	);
}

function PluginVersion({ id: pluginId, version, filename }: { id: string; version: string; filename: string }) {
	const { data } = useQuery({
		queryKey: ['plugin-version', 'plugin', pluginId, version],
		queryFn: () => Batcher.checkPluginVersion.get({ id: pluginId, version }),
	});

	const { id } = useParams() as { id: string };
	const axios = useClientApi();

	const { invalidateByKey } = useQueriesData();
	const { mutate, isPending } = useMutation({
		mutationKey: ['server', id, 'plugin', pluginId],
		mutationFn: (pluginId: string) =>
			Promise.allSettled([createServerPlugin(axios, id, { pluginId }), deleteServerPlugin(axios, id, filename)]),
		onSuccess: () => {
			toast.success(<Tran text="server.add-plugin-success" />);
		},
		onError: (error) => {
			toast.error(<Tran text="server.add-plugin-fail" />, { error });
		},
		onSettled: () => {
			invalidateByKey(['server', id, 'plugin']);
			invalidateByKey(['server', id, 'plugin-version']);
		},
	});

	if (data && new Date(Number(version)).getTime() !== new Date(data.version).getTime()) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							className="flex gap-1 items-center p-2 mt-auto rounded-md border w-fit bg-secondary"
							onClick={() => mutate(pluginId)}
							disabled={isPending}
						>
							{isPending ? (
								<LoadingSpinner />
							) : (
								<>
									<span className="text-destructive-foreground">{dateToId(new Date(Number(version)))}</span>
									<span>{'=>'}</span>
									<span className="text-success-foreground">{dateToId(new Date(data.version))}</span>
								</>
							)}
						</button>
					</TooltipTrigger>
					<TooltipContent>
						<Tran text="server.update-plugin" />
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return null;
}
