'use client';

import InfinitePage from '@/components/common/infinite-page';
import MindustryServerCard from '@/components/server/mindustry-server-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import getServers from '@/query/server/get-servers';
import { useRef } from 'react';

export default function Page() {
  const scrollContainer = useRef<HTMLDivElement | null>();
  const params = { page: 0 };

  return (
    <div className="flex h-full flex-col gap-2 py-2 pl-2">
      <div className="flex justify-end pr-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button title="Add server">Add server</Button>
          </DialogTrigger>
          <DialogContent>
            <input
              type="text"
              placeholder="Server address"
              className="border-b-2 border-border bg-transparent p-1 outline-none hover:border-b-2 hover:outline-none"
            />
          </DialogContent>
        </Dialog>
      </div>
      <div
        className="h-full overflow-y-auto pr-2"
        ref={(ref) => (scrollContainer.current = ref)}
      >
        <InfinitePage
          className="grid w-full grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:grid-cols-3"
          queryKey={['servers']}
          scrollContainer={scrollContainer.current}
          params={params}
          getFunc={getServers}
        >
          {(data) => <MindustryServerCard key={data.id} server={data} />}
        </InfinitePage>
      </div>
    </div>
  );
}
