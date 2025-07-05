'use client';

import { useEffect } from 'react';

import { TError, getErrorMessage, reportError } from '@/lib/error';

export default function Error({ error }: { error: TError }) {
	const message = getErrorMessage(error);

	useEffect(() => {
		reportError(error);
	}, [error]);

	return <div className="h-full w-full text-destructive-foreground">Unhandled: {message}</div>;
}
