import React from 'react';

import Tran from '@/components/common/tran';

type Props = {
	error: any;
};
export default function ErrorMessage({ error }: Props) {
	if (typeof error === 'object' && typeof error.message === 'string') {
		return <span className="text-destructive">{error.message}</span>;
	}

	return <Tran className="text-destructive" text="unknown-error" />;
}
