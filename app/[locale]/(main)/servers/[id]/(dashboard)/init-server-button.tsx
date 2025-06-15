'use client';

import { CheckCircleIcon, PowerIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import HasServerMap from '@/app/[locale]/(main)/servers/[id]/(dashboard)/has-server-map';

import ColorText from '@/components/common/color-text';
import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import Divider from '@/components/ui/divider';

import { revalidate } from '@/action/server-action';
import env from '@/constant/env';
import useHttpStream from '@/hooks/use-http-stream';
import useQueriesData from '@/hooks/use-queries-data';

type Props = {
	id: string;
};

export default function InitServerButton({ id }: Props) {
	const [visible, setVisible] = useState(false);
	const { invalidateByKey } = useQueriesData();

	const { data, last, mutate, isPending, isSuccess, isError, error } = useHttpStream({
		url: `${env.url.api}/servers/${id}/init`,
		method: 'POST',
		mutationKey: ['server', id, 'init'],
		onSettled: () => {
			invalidateByKey(['server']);
			revalidate({ path: '/[locale]/(main)/servers/[id]' });
		},
	});

	useEffect(() => {
		const containers = document.getElementsByClassName('scroll-container');

		if (containers) {
			for (const container of containers) {
				container.scrollTo({
					top: container.scrollHeight,
					behavior: 'smooth',
				});
			}
		}
	}, [data]);

	function handleVisible(value: boolean) {
		if (isPending) return;

		setVisible(value);

		if (isSuccess) {
			revalidate({ path: '/servers' });
		}
	}

	return (
		<HasServerMap id={id}>
			<Button
				className="min-w-20 border-none"
				title="Init"
				variant="primary"
				disabled={isPending}
				onClick={() => {
					mutate();
					setVisible(true);
				}}
			>
				<PowerIcon className="size-4" />
				<Tran text="server.init" />
			</Button>
			<Dialog open={visible} onOpenChange={handleVisible}>
				<DialogContent className="flex flex-col p-6 w-full h-full border rounded-lg">
					<DialogTitle>
						<Tran text="server.initiating-server" asChild />
					</DialogTitle>
					<DialogDescription className="flex overflow-hidden gap-1 items-center w-full text-ellipsis">
						{isPending ? (
							<LoadingSpinner className="justify-start p-0 m-0 w-4" />
						) : isError ? (
							<ErrorMessage error={error} />
						) : (
							<CheckCircleIcon className="w-4" />
						)}{' '}
						<ColorText text={last?.data} />
					</DialogDescription>
					<Divider />
					<ScrollContainer className="flex overflow-x-auto flex-col flex-1 w-full h-full">
						{data?.map((text, index, array) => (
							<div className="space-x-2 text-sm" key={index}>
								<span className="font-semibold">
									<span>{index}</span>(<span>{Math.round((text.createdAt - array[0].createdAt) / 10) / 100}s</span>)
								</span>
								<ColorText className="text-sm" text={text.data} />
							</div>
						))}
						{isError && <ErrorMessage error={error} />}
					</ScrollContainer>
					{isSuccess && (
						<DialogClose className="ml-auto" asChild>
							<Button>
								<Tran text="server.initiated" />
							</Button>
						</DialogClose>
					)}
				</DialogContent>
			</Dialog>
		</HasServerMap>
	);
}
