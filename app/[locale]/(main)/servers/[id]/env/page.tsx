import { Metadata } from 'next';

import env from '@/constant/env';
import { isError } from '@/lib/error';
import { formatTitle, generateAlternate } from '@/lib/utils';

import { getCachedServer } from '../(dashboard)/page';
import PageClient from './page.client';

type Props = {
	params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const server = await getCachedServer(id);

	if (isError(server)) {
		return { title: 'Error' };
	}

	const { name, description } = server;

	return {
		title: formatTitle(name),
		description,
		openGraph: {
			title: formatTitle(name),
			description,
			images: `${env.url.api}/servers/${id}/image`,
		},
		alternates: generateAlternate(`/servers/${id}/env`),
	};
}
export default async function Page({ params }: Props) {
	const { id } = await params;
	return <PageClient id={id} />;
}
