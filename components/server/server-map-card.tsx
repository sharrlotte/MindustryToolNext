'use client';

import React from 'react';

import DeleteButton from '@/components/button/delete.button';
import ColorText from '@/components/common/color-text';
import InternalLink from '@/components/common/internal-link';
import { Preview, PreviewDescription, PreviewHeader, PreviewImage } from '@/components/common/preview';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteServerMap } from '@/query/server';
import { ServerMap } from '@/types/response/ServerMap';

import { useMutation } from '@tanstack/react-query';

type ServerMapCardProps = {
	map: ServerMap;
};

export default function ServerMapCard({ map: { name, mapId, serverId } }: ServerMapCardProps) {
	const axios = useClientApi();
	const { invalidateByKey } = useQueriesData();

	const { mutate, isPending } = useMutation({
		mutationFn: () => deleteServerMap(axios, serverId, mapId),
		onSuccess: () => {
			toast(<Tran text="delete-success" />);
		},
		onError: (error) => {
			toast.error(<Tran text="delete-fail" />, { description: error?.message });
		},
		onSettled: () => {
			invalidateByKey(['servers', serverId, 'maps']);
		},
	});

	return (
		<Preview className="group relative flex flex-col justify-between">
			<InternalLink href={`/maps/${mapId}`}>
				<PreviewImage
					src={`${env.url.image}/map-previews/${mapId}${env.imageFormat}`}
					errorSrc={`${env.url.api}/maps/${mapId}/image`}
					alt={name ?? 'internal server map'}
				/>
			</InternalLink>
			<PreviewDescription>
				<PreviewHeader className="h-12">
					<ColorText text={name} />
				</PreviewHeader>
				<DeleteButton
					className="right-1 top-1"
					variant="ghost"
					isLoading={isPending}
					onClick={() => mutate()}
					description="delete"
				/>
			</PreviewDescription>
		</Preview>
	);
}
