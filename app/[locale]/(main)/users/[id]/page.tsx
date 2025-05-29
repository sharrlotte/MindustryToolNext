import { Metadata } from 'next';
import { cache } from 'react';

import Me from '@/app/[locale]/(main)/users/[id]/me';
import Other from '@/app/[locale]/(main)/users/[id]/other';

import ErrorScreen from '@/components/common/error-screen';

import { serverApi } from '@/action/common';
import { isError } from '@/lib/error';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';
import { getMe, getUser } from '@/query/user';

type Props = {
	params: Promise<{ id: string }>;
};

const getCachedUser = cache((id: string) => serverApi((axios) => (id === '@me' ? getMe(axios) : getUser(axios, { id }))));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;

	const user = await getCachedUser(id);

	if (isError(user)) {
		return { title: 'Error' };
	}

	const { name, imageUrl, roles, stats, thumbnail } = user;

	const description = {
		roles: roles.map((role) => role.name).join(', '),
		stats,
	};

	const images = [];

	if (thumbnail) {
		images.push(thumbnail);
	}

	if (imageUrl) {
		images.push(imageUrl);
	}

	return {
		title: formatTitle(name),
		description: Object.entries(description).join('\n'),
		openGraph: {
			title: name,
			description: roles.map((role) => role.name).join(', '),
			images,
		},
		alternates: generateAlternate(`/users/${id}`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;
	const user = await getCachedUser(id);

	if (isError(user)) {
		return <ErrorScreen error={user} />;
	}

	return id === '@me' ? <Me me={user} /> : <Other user={user} />;
}
