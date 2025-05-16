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
	serverId: string;
	map: ServerMap;
};

export default function ServerMapCard({ serverId, map: { name, filename } }: ServerMapCardProps) {
	const axios = useClientApi();
	const { invalidateByKey } = useQueriesData();

	const mapId = filename?.split('.')[0];
	const isValidUuid = mapId?.length === 36;

	const { mutate, isPending } = useMutation({
		mutationFn: () => deleteServerMap(axios, serverId, filename),
		onError: (error) => {
			toast.error(<Tran text="delete-fail" />, { error });
		},
		onSettled: () => {
			invalidateByKey(['servers', serverId, 'maps']);
		},
	});

	return (
		<Preview>
			<InternalLink href={`/maps/${mapId}`}>
				{isValidUuid && mapId && (
					<PreviewImage
						src={`${env.url.image}/map-previews/${mapId}${env.imageFormat}`}
						errorSrc={`${env.url.api}/maps/${mapId}/image`}
						alt={name ?? 'internal server map'}
					/>
				)}
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
