import { PageClient, RankPaginationNavigator } from '@/app/[locale]/(user)/rank/page.client';

export default function Page() {
  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      <PageClient />
      <RankPaginationNavigator />
    </div>
  );
}
