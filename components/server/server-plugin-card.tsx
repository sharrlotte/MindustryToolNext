'use client';

import Link from 'next/link';
import React from 'react';

import DeleteButton from '@/components/button/delete.button';
import ColorText from '@/components/common/color-text';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { omit } from '@/lib/utils';
import { deleteServerPlugin } from '@/query/server';
import { ServerPlugin } from '@/types/response/ServerPlugin';

import { useMutation } from '@tanstack/react-query';

type Props = {
	serverId: string;
	plugin: ServerPlugin;
};

export default function ServerPluginCard({ serverId, plugin: { name, filename, meta } }: Props) {
	const { invalidateByKey } = useQueriesData();

	const { description, version, author, repo } = meta;

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
		},
	});

	return (
		<div className="relative flex flex-col min-h-40 h-40 gap-1 overflow-hidden rounded-md bg-card p-2 border">
			<h2 className="line-clamp-1 overflow-hidden text-ellipsis whitespace-normal text-nowrap space-x-1">
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
					<p className="line-clamp-3 overflow-hidden text-ellipsis text-left text-secondary-foreground">
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
			<DeleteButton
				className="right-1 top-1 backdrop-brightness-100"
				variant="ghost"
				description={<Tran text="delete-alert" args={{ name }} />}
				isLoading={isDeleting}
				onClick={() => deletePluginById()}
			/>
		</div>
	);
}
