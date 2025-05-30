import React, { useEffect } from 'react';

import ReportErrorDialog from '@/components/common/report-error.dialog';
import Tran from '@/components/common/tran';

import { getErrorMessage, reportError } from '@/lib/error';
import { cn } from '@/lib/utils';

type Props = {
	className?: string;
	error: any;
};
export default function ErrorMessage({ className, error }: Props) {
	const message = getErrorMessage(error);

	useEffect(() => {
		reportError(error);
	}, [error]);

	if (message) {
		return (
			<span className={cn('text-destructive-foreground font-semibold p-2 text-sm space-x-1', className)}>
				{message}
				<ReportErrorDialog />
			</span>
		);
	}

	return (
		<span className={cn('text-destructive-foreground font-semibold p-2 text-sm space-x-1', className)}>
			<Tran text="unknown-error" />;
			<ReportErrorDialog />
		</span>
	);
}
