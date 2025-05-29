import { Metadata } from 'next';

import { getCachedServer } from '@/app/[locale]/(main)/servers/[id]/(dashboard)/action';

import env from '@/constant/env';
import { isError } from '@/lib/error';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';

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
		alternates: generateAlternate(`/servers/${id}/environments`),
	};
}
export default async function Page({ params }: Props) {
	const { id } = await params;
	return <PageClient id={id} />;
}
