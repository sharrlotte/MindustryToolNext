'use client';

import React from 'react';

import InfinitePage from '@/components/common/infinite-page';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import ServerPluginCard from '@/components/server/server-plugin-card';
import { Skeleton } from '@/components/ui/skeleton';

import { PaginationQuerySchema } from '@/query/search-query';
import { getServerPluginCount, getServerPlugins } from '@/query/server';

type Props = {
  id: string;
};

export default function ServerPluginPage({ id }: Props) {
  return (
    <>
      <ScrollContainer className="flex h-full w-full flex-col gap-2">
        <InfinitePage
          className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3"
          paramSchema={PaginationQuerySchema}
          queryKey={['servers', id, 'plugins']}
          queryFn={(axios, params) => getServerPlugins(axios, id, params)}
          skeleton={{
            amount: 20,
            item: <Skeleton className="h-32 w-full" />,
          }}
        >
          {(data) => <ServerPluginCard key={data.id} plugin={data} />}
        </InfinitePage>
      </ScrollContainer>
      <div className="flex justify-end">
        <div className="flex justify-end">
          <PaginationNavigator numberOfItems={(axios, params) => getServerPluginCount(axios, id, params)} queryKey={['servers', id, 'plugins', 'total']} />
        </div>
      </div>
    </>
  );
}
