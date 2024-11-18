'use client';

import dynamic from 'next/dynamic';
import React, { useRef } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import InternalServerPluginCard from '@/components/server/internal-server-plugin-card';
import { Button } from '@/components/ui/button';

import { getInternalServerPlugins } from '@/query/server';

const AddPluginDialog = dynamic(() => import('@/app/[locale]/(user)/servers/[id]/plugins/add-plugin-dialog'), {
  loading: () => (
    <Button className="ml-auto" title="Add plugin" variant="secondary">
      <Tran text="internal-server.add-plugin" />
    </Button>
  ),
});

type Props = {
  id: string;
};

export default function ServerPluginPage({ id }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <div className=" flex h-14 items-center justify-end bg-card p-2">
        <AddPluginDialog serverId={id} />
      </div>
      <ScrollContainer className="flex h-full w-full flex-col gap-2 overflow-y-auto" ref={ref}>
        <InfinitePage
          className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3"
          params={{ page: 0, size: 20 }}
          queryKey={['servers', id, 'plugins']}
          getFunc={(axios, params) => getInternalServerPlugins(axios, id, params)}
          container={() => ref.current}
        >
          {(data) => <InternalServerPluginCard key={data.pluginId} plugin={data} />}
        </InfinitePage>
      </ScrollContainer>
    </div>
  );
}
