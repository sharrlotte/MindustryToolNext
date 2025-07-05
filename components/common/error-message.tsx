import React from 'react';

import ReportErrorDialog from '@/components/common/report-error.dialog';
import Tran from '@/components/common/tran';

import { getErrorMessage } from '@/lib/error';
import { cn } from '@/lib/utils';

type Props = {
	className?: string;
	error: any;
};
export default function ErrorMessage({ className, error }: Props) {
	const message = getErrorMessage(error);

	if (message) {
		return (
			<span className={cn('text-destructive-foreground font-semibold p-2 text-sm space-x-1', className)}>
				<span className="font-semibold">{typeof window === 'undefined' ? 'SERVER' : 'CLIENT'}: </span>
				<span>{message}</span>
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
