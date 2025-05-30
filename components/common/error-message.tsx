import React from 'react';

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
		return <span className={cn('text-destructive-foreground font-semibold p-2 text-sm', className)}>{message}</span>;
	}

	return <Tran className={cn('text-destructive-foreground font-semibold p-2 text-sm', className)} text="unknown-error" />;
}
