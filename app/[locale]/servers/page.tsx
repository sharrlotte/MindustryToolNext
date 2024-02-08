'use client';

import InfinitePage from '@/components/common/infinite-page';
import MindustryServerCard from '@/components/server/mindustry-server-card';
import useSearchPageParams from '@/hooks/use-search-page-params';
import getServers from '@/query/server/get-servers';
import { useRef } from 'react';

export default function Page() {
  const scrollContainer = useRef<HTMLDivElement | null>();
  const params = useSearchPageParams();

  return (
    <div
      className="relative flex h-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-2"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <InfinitePage
        className="grid w-full grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:grid-cols-3"
        queryKey={['servers']}
        scrollContainer={scrollContainer.current}
        params={params}
        getFunc={getServers}
      >
        {(data) => <MindustryServerCard key={data.address} server={data} />}
      </InfinitePage>
    </div>
  );
}
