import React from 'react';

import { NotFoundIllustration } from '@/components/common/not-found-illustration';
import ReportErrorDialog from '@/components/common/report-error.dialog';
import Tran from '@/components/common/tran';
import BackButton from '@/components/ui/back-button';

import { NotFoundError, getErrorMessage } from '@/lib/error';
import { cn } from '@/lib/utils';

type Props = {
	className?: string;
	error: any;
};
export default function ErrorMessage({ className, error }: Props) {
	const message = getErrorMessage(error);

	console.log({ error, is: error instanceof NotFoundError });

	if (error instanceof NotFoundError) {
		return (
			<div className={cn('p-2 h-full grid place-items-center row-span-full col-span-full', className)}>
				<div className="flex flex-col items-center">
					<NotFoundIllustration />
					<Tran className="text-2xl" text="not-found" defaultValue="Not found" />
					<Tran
						className="text-sm"
						text="not-found-description"
						defaultValue="The page you are trying to access might have been moved, deleted, or you entered the wrong URL."
					/>
					<div className="mt-2">
						<BackButton />
					</div>
				</div>
			</div>
		);
	}

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
