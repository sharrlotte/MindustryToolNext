import { Metadata } from 'next/dist/types';
import React, { cache } from 'react';

import ErrorScreen from '@/components/common/error-screen';
import SchematicDetailCard from '@/components/schematic/schematic-detail-card';

import { serverApi } from '@/action/common';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { isError } from '@/lib/error';
import { formatTitle, generateAlternate } from '@/lib/utils';
import { getSchematic } from '@/query/schematic';

type Props = {
	params: Promise<{ id: string; locale: Locale }>;
};

const getCachedSchematic = cache((id: string) => serverApi((axios) => getSchematic(axios, { id })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const schematic = await getCachedSchematic(id);

	if (isError(schematic)) {
		return { title: 'Error' };
	}

	const { name, description, downloadCount, likes, dislikes } = schematic;

	return {
		title: formatTitle(name),
		description: [name, description].join('|'),
		openGraph: {
			title: name,
			description: `⬇️${downloadCount} 👍${likes} 👎${dislikes}\n${description}`,
			images: `${env.url.image}/schematics/${id}${env.imageFormat}`,
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
