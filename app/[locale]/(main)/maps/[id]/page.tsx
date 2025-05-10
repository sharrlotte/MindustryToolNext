import { Metadata } from 'next/dist/types';
import React, { cache } from 'react';

import ErrorScreen from '@/components/common/error-screen';
import MapDetailCard from '@/components/map/map-detail-card';

import { serverApi } from '@/action/common';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { isError } from '@/lib/error';
import { formatTitle, generateAlternate } from '@/lib/utils';
import { getMap } from '@/query/map';
import { getUser } from '@/query/user';

type Props = {
	params: Promise<{ id: string; locale: Locale }>;
};

const getCachedMap = cache((id: string) => serverApi((axios) => getMap(axios, { id })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const map = await getCachedMap(id);

	if (isError(map)) {
		return { title: 'Error' };
	}

	const { name, description, downloadCount, likes, dislikes, userId, tags, createdAt } = map;

	const user = await serverApi((axios) => getUser(axios, { id: userId }));

	if (isError(user)) {
		return { title: 'Error', description: user.error?.message };
	}

	return {
		title: formatTitle(name),
		description: [name, description].join('|'),
		openGraph: {
			type: 'article',
			title: name,
			description: `Author: ${user.name} ⬇️\n\n${downloadCount} 👍${likes} 👎${dislikes}\n\nTags: ${tags.map((tag) => tag.name)} \n\n \n\n${description}`,
			images: `${env.url.image}/maps/${id}${env.imageFormat}`,
			authors: [`${env.url.image}/users/${userId}`],
			tags: tags.map((tag) => tag.name),
			publishedTime: new Date(createdAt).toISOString(),
		},
		alternates: generateAlternate(`/maps/${id}`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;
	const map = await getCachedMap(id);

	if (isError(map)) {
		return <ErrorScreen error={map} />;
	}

	return <MapDetailCard map={map} />;
}
