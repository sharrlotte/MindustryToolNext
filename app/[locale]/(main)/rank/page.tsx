import { Metadata } from 'next';

import { PageClient, RankPaginationNavigator } from '@/app/[locale]/(main)/rank/page.client';

import ErrorMessage from '@/components/common/error-message';

import { serverApi } from '@/action/common';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { isError } from '@/lib/error';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';
import { getRank } from '@/query/user';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/types/schema/search-query';

type Props = {
	searchParams: Promise<ItemPaginationQueryType>;
	params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('rank');

	return {
		title: formatTitle(title),
		alternates: generateAlternate('/rank'),
	};
}

export default async function Page({ searchParams }: Props) {
	const { data, success, error } = ItemPaginationQuery.safeParse(await searchParams);

	if (!success || !data) {
		return <ErrorMessage error={error} />;
	}

	const users = await serverApi((axios) => getRank(axios, data));

	if (isError(users)) {
		return <ErrorMessage error={users} />;
	}

	return (
		<div className="flex h-full flex-col gap-2 overflow-hidden p-2">
			<PageClient users={users} params={data} />
			<RankPaginationNavigator />
		</div>
	);
}
