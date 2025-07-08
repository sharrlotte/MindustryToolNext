import React, { Suspense } from 'react';

import SchematicDetailCard from '@/components/schematic/schematic-detail-card';
import DetailSkeleton from '@/components/skeleton/detail.skeleton';

import { getCachedSchematic, getCachedUser } from '@/action/query';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { getErrorMessage, isError } from '@/lib/error';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';

import { Metadata } from 'next/dist/types';

type Props = {
	params: Promise<{ id: string; locale: Locale }>;
};

export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id, locale } = await params;
	const { t } = await getTranslation(locale, 'tags');
	const schematic = await getCachedSchematic(id);

	if (isError(schematic)) {
		return { title: 'Error' };
	}

	const { name, description, downloadCount, likes, dislikes, userId, tags, createdAt } = schematic;

	const user = await getCachedUser(userId);

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
	const { id, locale } = await params;

	return (
		<Suspense fallback={<DetailSkeleton />}>
			<SchematicDetailCard id={id} locale={locale} />
		</Suspense>
	);
}
