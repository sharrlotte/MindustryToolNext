'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import InfinitePage from '@/components/common/infinite-page';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import ServerPluginCard from '@/components/server/server-plugin-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { PaginationQuerySchema } from '@/query/search-query';
import { getServerPluginCount, getServerPlugins } from '@/query/server';

const AddPluginDialog = dynamic(() => import('@/app/[locale]/(user)/servers/[id]/plugins/add-plugin-dialog'), {
  loading: () => (
    <Button className="ml-auto" title="Add plugin" variant="secondary">
      <Tran text="server.add-plugin" />
    </Button>
  ),
});

type Props = {
  id: string;
};

export default function ServerPluginPage({ id }: Props) {
  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <div className=" flex h-14 items-center justify-end bg-card p-2">
        <AddPluginDialog serverId={id} />
      </div>
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
    </div>
  );
}
