'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

import env from '@/constant/env';

export default function ServerImage({ id, alt }: { id: string; alt: string }) {
	const [key, setKey] = useState(0);

	useInterval(() => setKey((prev) => prev + 1), 1000 * 60);

	return (
		<Image
			key={key}
			id="server-map-preview"
			className="object-contain overflow-hidden w-full h-auto rounded-md border"
			src={`${env.url.api}/servers/${id}/image`}
			alt={alt}
			width={500}
			height={500}
		/>
	);
}
