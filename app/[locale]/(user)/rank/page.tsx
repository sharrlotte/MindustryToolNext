import { serverApi } from '@/action/action';
import { PageClient, RankPaginationNavigator } from '@/app/[locale]/(user)/rank/page.client';
import ErrorScreen from '@/components/common/error-screen';
import { isError } from '@/lib/utils';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';
import { getRank } from '@/query/user';

type Props = {
  searchParams: Promise<ItemPaginationQueryType>;
};

export default async function Page({ searchParams }: Props) {
  const { data, success, error } = ItemPaginationQuery.safeParse(await searchParams);

  if (!success || !data) {
    return <ErrorScreen error={error} />;
  }

  const users = await serverApi((axios) => getRank(axios, data));

  if (isError(users)) {
    return <ErrorScreen error={users} />;
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      <PageClient users={users} />
      <RankPaginationNavigator />
    </div>
  );
}
