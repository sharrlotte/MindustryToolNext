import { Metadata } from 'next';
import React, { cache } from 'react';

import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';
import UploadMapDetailCard from '@/components/map/upload-map-detail-card';
import BackButton from '@/components/ui/back-button';

import { serverApi } from '@/action/common';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { formatTitle } from '@/lib/utils';
import { getMapUpload } from '@/query/map';
import { isError } from '@/lib/error';
import { generateAlternate } from '@/lib/i18n.utils';

type Props = {
	params: Promise<{ id: string; locale: Locale }>;
};

const getCachedMapUpload = cache((id: string) => serverApi((axios) => getMapUpload(axios, { id })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;

	const map = await getCachedMapUpload(id);

	if (isError(map)) {
		return { title: 'Error' };
	}

	const { name, description } = map;

	return {
		title: formatTitle(name),
		description: [name, description].join('|'),
		openGraph: {
			title: name,
			description: description,
			images: `${env.url.image}/maps/${id}${env.imageFormat}`,
		},
		alternates: generateAlternate(`/admin/maps/${id}`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;
	const map = await getCachedMapUpload(id);

	if (isError(map)) {
		return <ErrorScreen error={map} />;
	}

	if (map.isVerified === true) {
		return (
			<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background">
				<Tran text="admin.item-has-been-verified" />
				<BackButton />
			</div>
		);
	}

	return <UploadMapDetailCard map={map} />;
}
