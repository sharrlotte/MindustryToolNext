'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

import { Hidden } from '@/components/common/hidden';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import env from '@/constant/env';

export default function MarkdownImage({ src, alt }: any) {
	const [isError, setError] = useState(false);

	if (src && src.includes(env.url.base)) {
		src = src && 'blob:' + src.substring(0, src.lastIndexOf('.'));
	}

	src = src.replace('image.mindustry-tool.app', 'image.mindustry-tool.com');

	if (isError) {
		return alt;
	}

	const width = new URL(src).searchParams.get('w') ?? undefined;
	const height = new URL(src).searchParams.get('h') ?? undefined;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<img
					className="markdown-image rounded-md max-h-[50dvh]"
					alt={alt}
					src={src}
					width={width}
					height={height}
					onError={() => setError(true)}
				/>
			</DialogTrigger>
			<DialogContent className="max-w-[100dvw] max-h-dvh sm:max-h-dvh flex justify-center items-center h-full">
				<Hidden>
					<DialogTitle />
					<DialogDescription />
				</Hidden>
				<img alt={alt} src={src} onError={() => setError(true)} />
			</DialogContent>
		</Dialog>
	);
}
