import { Metadata } from 'next';

import Client from '@/app/[locale]/(main)/posts/page.client';

import ErrorScreen from '@/components/common/error-screen';

import { serverApi } from '@/action/action';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, isError } from '@/lib/utils';
import { getPosts } from '@/query/post';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';

type Props = {
  searchParams: Promise<ItemPaginationQueryType>;
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, ['common', 'meta']);
  const title = t('post');

  return {
    title: formatTitle(title),
    description: t('server-description'),
    openGraph: {
      title: formatTitle(title),
      description: t('server-description'),
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const { data, success, error } = ItemPaginationQuery.safeParse(await searchParams);

  if (!success || !data) {
    return <ErrorScreen error={error} />;
  }

  const posts = await serverApi((axios) => getPosts(axios, data));

  if (isError(posts)) {
    return <ErrorScreen error={posts} />;
  }

  return <Client posts={posts} />;
}
