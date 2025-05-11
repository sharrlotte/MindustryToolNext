import React from 'react';

import Tran from '@/components/common/tran';

import { getErrorMessage } from '@/lib/error';

type Props = {
	error: any;
};
export default function ErrorMessage({ error }: Props) {
	console.log(error);

	const message = getErrorMessage(error);

	if (message) {
		return <span className="text-destructive-foreground p-2 text-sm">{message}</span>;
	}

	return <Tran className="text-destructive-foreground p-2 text-sm" text="unknown-error" />;
}
