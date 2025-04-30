import { Metadata } from 'next';
import React from 'react';

import { ServerSettingButton } from '@/app/[locale]/(main)/servers/[id]/setting/delete-setting-button';
import ServerUpdateAdminForm from '@/app/[locale]/(main)/servers/[id]/setting/server-update-admin-form';
import ServerUpdateForm from '@/app/[locale]/(main)/servers/[id]/setting/server-update-form';

import ErrorScreen from '@/components/common/error-screen';
import RequireLogin from '@/components/common/require-login';
import ScrollContainer from '@/components/common/scroll-container';

import { getSession, serverApi } from '@/action/common';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import ProtectedElement from '@/layout/protected-element';
import { isError } from '@/lib/error';
import { formatTitle, generateAlternate } from '@/lib/utils';
import { getServerSetting } from '@/query/server';

type Props = {
	params: Promise<{ id: string; locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id, locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('setting');

	return {
		title: formatTitle(title),
		alternates: generateAlternate(`/servers/${id}/setting`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;

	const [server, session] = await Promise.all([serverApi((axios) => getServerSetting(axios, { id })), getSession()]);

	if (isError(server)) {
		return <ErrorScreen error={server} />;
	}

	if (isError(session)) {
		return <ErrorScreen error={session} />;
	}

	if (!session) {
		return <RequireLogin />;
	}

	return (
		<ScrollContainer className="flex h-full flex-col gap-2">
			<ServerUpdateForm server={server} />
			<ProtectedElement session={session} filter={{ authority: 'EDIT_ADMIN_SERVER' }}>
				<ServerUpdateAdminForm server={server} />
			</ProtectedElement>
			<ProtectedElement session={session} filter={{ any: [{ authority: 'EDIT_ADMIN_SERVER' }, { authorId: server.userId }] }}>
				<ServerSettingButton id={id} />
			</ProtectedElement>
		</ScrollContainer>
	);
}
