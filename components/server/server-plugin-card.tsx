'use client';

import React from 'react';

import DeleteButton from '@/components/button/delete.button';
import ColorText from '@/components/common/color-text';
import Tran from '@/components/common/tran';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteServerPlugin } from '@/query/server';
import { ServerPlugin } from '@/types/response/ServerPlugin';

import { useMutation } from '@tanstack/react-query';

type Props = {
	serverId: string;
	plugin: ServerPlugin;
};

export default function ServerPluginCard({ serverId, plugin: { name, filename, meta } }: Props) {
	const { invalidateByKey } = useQueriesData();

	const { description } = meta;

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
		<Popover>
			<div className="relative grid h-32 gap-2 overflow-hidden rounded-sm bg-card p-4 border">
				<PopoverTrigger className="flex w-full items-start justify-start overflow-hidden text-ellipsis">
					<h2 className="line-clamp-1 overflow-hidden text-ellipsis whitespace-normal text-nowrap">
						<ColorText text={name} />
					</h2>
				</PopoverTrigger>
				<DeleteButton
					className="right-1 top-1 backdrop-brightness-100"
					variant="ghost"
					description={<Tran text="delete-alert" args={{ name }} />}
					isLoading={isDeleting}
					onClick={() => deletePluginById()}
				/>
			</div>
			<PopoverContent>
				<p>{description}</p>
			</PopoverContent>
		</Popover>
	);
}
