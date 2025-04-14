'use client';

import { notFound } from 'next/navigation';
import { useEffect } from 'react';

import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';

import { TError, getErrorMessage } from '@/lib/error';

export default function ErrorScreen({ error }: { error: TError }) {
	const message = getErrorMessage(error);

	useEffect(() => {
		reportError(error);
	}, [error]);

	if (typeof error === 'object' && 'error' in error && 'status' in error.error && error.error.status === 404) return notFound();

	return (
		<div className="error flex h-full w-full flex-col items-center justify-center gap-2 bg-background p-2">
			<h2 className="text-base font-bold">{message}</h2>
			<div className="grid grid-cols-2 items-center justify-center gap-2">
				<a
					className="h-9 flex-1 text-nowrap rounded-md text-sm border border-border justify-center items-center px-4 py-2"
					href="https://discord.gg/DCX5yrRUyp"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Tran text="report-error-at" />
				</a>
				<Button className="flex-1" variant="primary" onClick={() => window.location.reload()}>
					<Tran text="refresh" />
				</Button>
			</div>
		</div>
	);
}
