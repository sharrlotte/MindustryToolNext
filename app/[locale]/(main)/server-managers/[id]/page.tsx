'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import React, { use, useState } from 'react';

import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';

import useClientApi from '@/hooks/use-client';
import useClipboard from '@/hooks/use-clipboard';
import useQueriesData from '@/hooks/use-queries-data';
import useServerManager from '@/hooks/use-server-manager';
import { resetTokenServerManager } from '@/query/server-manager';

import { useMutation } from '@tanstack/react-query';

type Props = {
	params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
	const { id } = use(params);

	const [showAccessToken, setShowAccessToken] = useState(false);
	const [showSecurityKey, setShowSecurityKey] = useState(false);

	const { data, isLoading, isError, error } = useServerManager(id);

	const copy = useClipboard();

	function handleCopy(data: string) {
		copy({ data, title: 'copied' });
	}

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	if (isLoading) {
		return (
			<div className="grid w-full h-full items-center grid-cols-[repeat(auto-fill,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2">
				<LoadingSpinner />
			</div>
		);
	}

	if (!data) {
		return notFound();
	}

	const { name, address, accessToken, securityKey } = data;

	return (
		<div className="flex flex-col p-2 gap-2">
			<h2>{name}</h2>
			<p className="px-3 w-fit py-0.5 border-foreground text-xs rounded-full border">{address}</p>
			<Divider />
			<Tran text="server.security-key" />
			<div className="flex gap-2">
				<Input
					className="w-80 cursor-pointer text-muted-foreground" //
					key={showSecurityKey + ''}
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
					className="w-80 min-h-20 cursor-pointer text-muted-foreground"
					key={showAccessToken + ''}
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
			<div className="flex">
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
		mutationFn: async () => resetTokenServerManager(axios, id),
		onSuccess: () => toast.success(<Tran text="server.reset-token-success" />),
		onError: (error) => toast.error(<Tran text="server.shutdown-fail" />, { error }),

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
