import { Metadata } from 'next';
import React from 'react';

import { RoleTable } from '@/app/[locale]/(main)/admin/setting/roles/role.table';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import ProtectedRoute from '@/layout/protected-route';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';

type Props = {
	params: Promise<{
		locale: Locale;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('roles');

	return {
		title: formatTitle(title),
		alternates: generateAlternate('/admin/setting/roles'),
	};
}

export default async function Page() {
	return (
		<ProtectedRoute filter={{ authority: 'EDIT_ROLE_AUTHORITY' }}>
			<RoleTable />
		</ProtectedRoute>
	);
}
