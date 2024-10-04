'use client';

import React, { useState } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import InternalServerPluginCard from '@/components/server/internal-server-plugin-card';

import { getInternalServerPlugins } from '@/query/server';
import { AddPluginDialog } from '@/app/[locale]/(user)/servers/[id]/plugins/add-plugin-dialog';
import useSearchId from '@/hooks/use-search-id-params';

export default function Page() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { id } = useSearchId();

  return (
    <div className="flex flex-col gap-2 overflow-hidden pl-2">
      <div className=" flex justify-end bg-card p-2">
        <AddPluginDialog serverId={id} />
      </div>
      <div
        className="flex h-full w-full flex-col gap-2 overflow-y-auto"
        ref={(ref) => setContainer(ref)}
      >
        <InfinitePage
          className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3"
          params={{ page: 0, size: 20 }}
          queryKey={['servers', id, 'plugins']}
          getFunc={(axios, params) =>
            getInternalServerPlugins(axios, id, params)
          }
          container={() => container}
        >
          {(data) => (
            <InternalServerPluginCard key={data.pluginId} plugin={data} />
          )}
        </InfinitePage>
      </div>
    </div>
  );
}
