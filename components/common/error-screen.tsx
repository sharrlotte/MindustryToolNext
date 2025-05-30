'use client';

import { useEffect, useMemo } from 'react';

import ReportErrorDialog from '@/components/common/report-error.dialog';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';

import { TError, getErrorMessage, reportError } from '@/lib/error';

export default function ErrorScreen({ error }: { error: TError }) {
	const message = useMemo(() => getErrorMessage(error), [error]);

	useEffect(() => {
		reportError(error);
	}, [error]);

	return (
		<div className="error flex h-full w-full flex-col items-center justify-center gap-2 bg-background p-2">
			<h2 className="text-base font-bold">{message}</h2>
			<div className="grid grid-cols-2 items-center justify-center gap-2">
				<ReportErrorDialog />
				<Button className="flex-1" variant="primary" onClick={() => window.location.reload()}>
					<Tran text="refresh" />
				</Button>
			</div>
		</div>
	);
}
