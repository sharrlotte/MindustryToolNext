import { Metadata } from 'next/dist/types';
import React, { cache } from 'react';

import ErrorScreen from '@/components/common/error-screen';
import SchematicDetailCard from '@/components/schematic/schematic-detail-card';

import { serverApi } from '@/action/common';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { getErrorMessage, isError } from '@/lib/error';
import { formatTitle, generateAlternate } from '@/lib/utils';
import { getSchematic } from '@/query/schematic';
import { getUser } from '@/query/user';

type Props = {
	params: Promise<{ id: string; locale: Locale }>;
};

const getCachedSchematic = cache((id: string) => serverApi((axios) => getSchematic(axios, { id })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id, locale } = await params;
	const { t } = await getTranslation(locale, 'tags');
	const schematic = await getCachedSchematic(id);

	if (isError(schematic)) {
		return { title: 'Error' };
	}

	const { name, description, downloadCount, likes, dislikes, userId, tags, createdAt } = schematic;

	const user = await serverApi((axios) => getUser(axios, { id: userId }));

	if (isError(user)) {
		return { title: 'Error', description: getErrorMessage(user) };
	}

	return {
		title: formatTitle(name),
		description: [name, description].join('|'),
		openGraph: {
			type: 'article',
			title: name,
			description: `Author: ${user.name}\n\n⬇️${downloadCount} 👍${likes} 👎${dislikes} \n\nTags: ${tags
				.map((tag) => t(tag.name))
				.join(', ')} \n\n${description}`,
			images: `${env.url.image}/schematics/${id}${env.imageFormat}`,
			authors: [`${env.url.image}/users/${userId}`],
			tags: tags.map((tag) => tag.name),
			publishedTime: new Date(createdAt).toISOString(),
		},
		alternates: generateAlternate(`/schematics/${id}`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;
	const schematic = await getCachedSchematic(id);

	if (isError(schematic)) {
		return <ErrorScreen error={schematic} />;
	}

	return <SchematicDetailCard schematic={schematic} />;
}
