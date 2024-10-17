'use client';

import React, { useRef } from 'react';

import InternalServerMapCard from '@/components/server/internal-server-map-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';

import { getInternalServerMaps } from '@/query/server';
import { AddMapDialog } from '@/app/[locale]/(user)/servers/[id]/maps/add-map-dialog';
import InfinitePage from '@/components/common/infinite-page';
import useSearchId from '@/hooks/use-search-id-params';
import ScrollContainer from '@/components/common/scroll-container';

export default function ServerMaps() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { id } = useSearchId();

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <div className="flex h-14 items-center justify-end bg-card p-2">
        <AddMapDialog serverId={id} />
      </div>
      <ScrollContainer className="flex h-full w-full flex-col gap-2 overflow-y-auto" ref={ref}>
        <InfinitePage
          params={{ page: 0, size: 20 }}
          queryKey={['servers', id, 'maps']}
          getFunc={(axios, params) => getInternalServerMaps(axios, id, params)}
          container={() => ref.current}
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
        >
          {(data) => <InternalServerMapCard key={data.mapId} map={data} />}
        </InfinitePage>
      </ScrollContainer>
    </div>
  );
}
