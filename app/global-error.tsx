'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { TError, getErrorMessage, reportError } from '@/lib/error';

import './globals.css';

const StarScene = dynamic(() => import('@/components/common/star-scene'), { ssr: false });

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
