'use client';

import React, { useState } from 'react';

import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import InternalServerMapCard from '@/components/server/internal-server-map-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import useSafeParam from '@/hooks/use-safe-param';

import { getInternalServerMaps } from '@/query/server';
import { AddMapDialog } from '@/app/[locale]/(user)/servers/[id]/maps/add-map-dialog';

export default function ServerMaps() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const id = useSafeParam().get('id');

  return (
    <div className="flex flex-col gap-2 overflow-hidden pl-2">
      <div className=" flex justify-end bg-card p-2">
        <AddMapDialog serverId={id} />
      </div>
      <div
        className="flex h-full w-full flex-col gap-2 overflow-y-auto"
        ref={(ref) => setContainer(ref)}
      >
        <ResponsiveInfiniteScrollGrid
          params={{ page: 0, size: 20 }}
          queryKey={['servers', id, 'maps']}
          getFunc={(axios, params) => getInternalServerMaps(axios, id, params)}
          container={() => container}
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
          itemMinWidth={320}
          itemMinHeight={352}
          contentOffsetHeight={112}
          gap={8}
        >
          {(data) => <InternalServerMapCard key={data.mapId} map={data} />}
        </ResponsiveInfiniteScrollGrid>
      </div>
    </div>
  );
}
