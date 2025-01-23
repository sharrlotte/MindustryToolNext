'use client';

import dynamic from 'next/dynamic';
import React, { useRef } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import ServerMapCard from '@/components/server/server-map-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { Button } from '@/components/ui/button';

import { getServerMaps } from '@/query/server';

const AddMapDialog = dynamic(() => import('@/app/[locale]/(user)/servers/[id]/maps/add-map-dialog'), {
  loading: () => (
    <Button className="ml-auto" title="Add map" variant="secondary">
      <Tran text="server.add-map" />
    </Button>
  ),
});

type Props = {
  id: string;
};

export default function ServerMaps({ id }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <div className="flex h-14 items-center justify-end bg-card p-2">
        <AddMapDialog serverId={id} />
      </div>
      <ScrollContainer className="flex h-full w-full flex-col gap-2" ref={ref}>
        <InfinitePage
          params={{ page: 0, size: 20 }}
          queryKey={['servers', id, 'maps']}
          queryFn={(axios, params) => getServerMaps(axios, id, params)}
          container={() => ref.current}
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
        >
          {(data) => <ServerMapCard key={data.id} map={data} />}
        </InfinitePage>
      </ScrollContainer>
    </div>
  );
}
