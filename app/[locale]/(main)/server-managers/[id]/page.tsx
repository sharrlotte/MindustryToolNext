'use client';

import { notFound } from 'next/navigation';
import React, { use, useState } from 'react';

import ErrorMessage from '@/components/common/error-message';
import { EyeIcon, EyeOffIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/loading-spinner';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';

import useClientApi from '@/hooks/use-client';
import useClipboard from '@/hooks/use-clipboard';
import useQueriesData from '@/hooks/use-queries-data';
import { getMyServerManagerById, resetTokenServerManager } from '@/query/server';

import { useMutation, useQuery } from '@tanstack/react-query';

type Props = {
	params: Promise<{ id: string }>;
};
export default function Page({ params }: Props) {
	const { id } = use(params);

	const [showAccessToken, setShowAccessToken] = useState(false);
	const [showSecurityKey, setShowSecurityKey] = useState(false);
	const axios = useClientApi();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['server-manager', id],
		queryFn: () => getMyServerManagerById(axios, id),
	});

	const copy = useClipboard();

	function handleCopy(data: string) {
		copy({ data, title: 'copied' });
	}

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	if (isLoading) {
		return (
			<div className="grid w-full h-full items-center grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2">
				<LoadingSpinner />
			</div>
		);
	}

	if (!data) {
		return notFound();
	}

	const { name, address, accessToken, securityKey } = data;

	return (
		<div className="grid p-2 space-y-2">
			<h1>{name}</h1>
			<p className="text-sm text-muted-foreground">{address}</p>
			<Tran text="server.security-key" />
			<div className="flex gap-2">
				<Input
					className="w-80 cursor-pointer text-muted-foreground" //
					defaultValue={showSecurityKey ? securityKey : '**********************************************'}
					onClick={() => handleCopy(securityKey)}
					readOnly
				/>
				<Button onClick={() => setShowSecurityKey((prev) => !prev)} variant="ghost">
					{showSecurityKey ? <EyeOffIcon /> : <EyeIcon />}
				</Button>
			</div>
			<Tran text="server.access-token" />
			<div className="flex gap-2">
				<Textarea
					className="w-80 min-h-40 cursor-pointer text-muted-foreground"
					defaultValue={
						showAccessToken
							? accessToken
							: '****************************************************************************************'
					}
					onClick={() => handleCopy(accessToken)}
					readOnly
				/>
				<Button onClick={() => setShowAccessToken((prev) => !prev)} variant="ghost">
					{showAccessToken ? <EyeOffIcon /> : <EyeIcon />}
				</Button>
			</div>
			<div className="flex justify-end">
				<ResetTokenButton id={id} />
			</div>
		</div>
	);
}

type ResetTokenButtonProps = {
	id: string;
};
function ResetTokenButton({ id }: ResetTokenButtonProps) {
	const axios = useClientApi();
	const { invalidateByKey } = useQueriesData();

	const { mutate, isPending } = useMutation({
		mutationKey: ['reset-token'],
		mutationFn: async () =>
			toast.promise(resetTokenServerManager(axios, id), {
				success: <Tran text="server.reset-token-success" />,
				error: (error) => <Tran text="error" args={{ message: error?.message }} />,
			}),
		onSettled: () => {
			invalidateByKey(['server-manager']);
		},
	});

	return (
		<Button onClick={() => mutate()} disabled={isPending}>
			<Tran text="server.reset-token" />
		</Button>
	);
}
