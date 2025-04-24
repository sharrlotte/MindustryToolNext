import React from 'react';

import Tran from '@/components/common/tran';

type Props = {
	error: any;
};
export default function ErrorMessage({ error }: Props) {
	if (error && typeof error === 'object' && typeof error.message === 'string') {
		return <span className="text-destructive p-2">{error.message}</span>;
	}

	return <Tran className="text-destructive p-2" text="unknown-error" />;
}
