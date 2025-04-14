import { Metadata } from 'next';
import React, { cache } from 'react';
import removeMd from 'remove-markdown';

import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';
import UploadPostDetailCard from '@/components/post/upload-post-detail-card';
import BackButton from '@/components/ui/back-button';

import { serverApi } from '@/action/common';
import { YOUTUBE_VIDEO_REGEX, formatTitle, generateAlternate } from '@/lib/utils';
import { getPostUpload } from '@/query/post';
import { isError } from '@/lib/error';

type Props = {
	params: Promise<{ id: string }>;
};

const getCachedPostUpload = cache((id: string) => serverApi((axios) => getPostUpload(axios, { id })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const post = await getCachedPostUpload(id);

	if (isError(post)) {
		return { title: 'Error' };
	}

	const urls = YOUTUBE_VIDEO_REGEX.exec(post.content) ?? [];

	const { title, content, imageUrls } = post;

	return {
		title: formatTitle(title),
		description: [title, removeMd(content)].join('|'),
		openGraph: {
			title: formatTitle(title),
			description: [title, removeMd(content)].join('|'),
			images: imageUrls.concat([...urls]),
		},
		alternates: generateAlternate(`/admin/posts/${id}`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;
	const post = await getCachedPostUpload(id);

	if (isError(post)) {
		return <ErrorScreen error={post} />;
	}

	if (post.isVerified === true) {
		return (
			<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background">
				<Tran text="admin.item-has-been-verified" />
				<BackButton />
			</div>
		);
	}

	return <UploadPostDetailCard post={post} />;
}
