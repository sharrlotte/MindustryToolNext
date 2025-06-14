import { Metadata } from 'next/dist/types';
import React from 'react';

import ErrorMessage from '@/components/common/error-message';
import Tran from '@/components/common/tran';
import UploadSchematicDetailCard from '@/components/schematic/upload-schematic-detail-card';
import BackButton from '@/components/ui/back-button';

import { getCachedSchematicUpload } from '@/action/query';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { isError } from '@/lib/error';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';

type Props = {
	params: Promise<{ id: string; locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const schematic = await getCachedSchematicUpload(id);

	if (isError(schematic)) {
		return { title: 'Error' };
	}

	const { name, description } = schematic;

	return {
		title: formatTitle(name),
		description: [name, description].join('|'),
		openGraph: {
			title: name,
			description: description,
			images: `${env.url.image}/schematics/${id}${env.imageFormat}`,
		},
		alternates: generateAlternate(`/admin/schematics/${id}`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;

	const schematic = await getCachedSchematicUpload(id);

	if (isError(schematic)) {
		return <ErrorMessage error={schematic} />;
	}

	if (schematic.isVerified === true) {
		return (
			<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background">
				<Tran text="admin.item-has-been-verified" />
				<BackButton />
			</div>
		);
	}

	return <UploadSchematicDetailCard schematic={schematic} />;
}
