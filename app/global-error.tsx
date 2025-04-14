'use client';

import { useEffect } from 'react';

import StarScene from '@/components/common/star-scene';

import { TError, getErrorMessage, reportError } from '@/lib/error';

import './globals.css';

export default function Error({ error }: { error: TError }) {
	const message = getErrorMessage(error);

	useEffect(() => {
		reportError(error);
	}, [error]);

	return (
		<div className="h-full w-full bg-black">
			<StarScene message={message} />
		</div>
	);
}
