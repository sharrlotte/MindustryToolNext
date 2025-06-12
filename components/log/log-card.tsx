import Image from 'next/image';
import React from 'react';

import RemoveButton from '@/components/button/remove.button';
import { toast } from '@/components/ui/sonner';
import IdUserCard from '@/components/user/id-user-card';

import useClientApi from '@/hooks/use-client';
import { deleteImage } from '@/query/image';
import { Log } from '@/types/Log';

import { useQueryClient } from '@tanstack/react-query';

type LogCardProps = {
	log: Log;
};

export default function LogCard({ log: { requestUrl, ip, userId, content, createdAt, environment, type } }: LogCardProps) {
	return (
		<div className="flex w-full flex-col break-words rounded-md bg-card p-2 text-xs h-full">
			{userId && (
				<span>
					<IdUserCard id={userId} />
				</span>
			)}
			{requestUrl && <span>URL: {requestUrl}</span>}
			<span>IP: {ip}</span>
			Env: {environment === 1 ? 'Prod' : 'Dev'}
			{type === 11 ? (
				<div>
					<div>{content}</div>
					<Image
						className="size-64 rounded-md overflow-hidden object-contain"
						src={content}
						width={256}
						height={256}
						alt={content}
					/>
					<DeleteImage path={content} />
				</div>
			) : (
				<div>
					Content:
					{content.split('\n').map((item, index) => (
						<span key={index}>{item}</span>
					))}
				</div>
			)}
			<span>Created at: {new Date(createdAt).toLocaleString()}</span>
		</div>
	);
}

function DeleteImage({ path }: { path: string }) {
	const axios = useClientApi();
	const queryClient = useQueryClient();

	return (
		<RemoveButton
			isLoading={false}
			description={`Are you sure you want to delete ${path}?`}
			onClick={async () => {
				try {
					await deleteImage(axios, path);
					queryClient.invalidateQueries({ queryKey: ['images'] });
				} catch (error: any) {
					toast.error('Failed to delete image', { error });
				}
			}}
		/>
	);
}
