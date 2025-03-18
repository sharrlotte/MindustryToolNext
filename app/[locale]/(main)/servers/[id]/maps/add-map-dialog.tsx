'use client';

import { useState } from 'react';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import LoadingScreen from '@/components/common/loading-screen';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import { PreviewImage } from '@/components/common/preview';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import NameTagSearch from '@/components/search/name-tag-search';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';

import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { cn } from '@/lib/utils';
import { getMapCount, getMaps } from '@/query/map';
import { ItemPaginationQuery } from '@/query/search-query';
import { createServerMap } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type AddMapDialogProps = {
  serverId: string;
};

export default function AddMapDialog({ serverId }: AddMapDialogProps) {
  const [added, setAdded] = useState<string[]>([]);

  const [show, setShow] = useState(false);
  const axios = useClientApi();

  const { invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationFn: (mapId: string) => createServerMap(axios, serverId, { mapId }),
    onSuccess: (_, mapId) => {
      toast.success(<Tran text="interval-server.add-map-success" />);
      setAdded((prev) => [...prev, mapId]);
    },
    onError: (error) => {
      toast.error(<Tran text="interval-server.add-map-fail" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['servers', serverId, 'maps']);
    },
  });

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button className="ml-auto" title="Add map" variant="secondary">
          <Tran text="internal-server.add-map" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex w-full h-full flex-col overflow-hidden max-w-full max-h-full p-4">
        <DialogTitle>
          <Tran text="internal-server.select-map" />
        </DialogTitle>
        {isPending && <LoadingScreen />}
        <div className="flex h-full flex-col justify-start gap-2 overflow-hidden">
          <NameTagSearch type="map" />
          <ScrollContainer className="flex h-full w-full flex-col gap-2">
            <ListLayout>
              <InfinitePage
                paramSchema={ItemPaginationQuery}
                queryKey={['maps']}
                queryFn={(axios, params) => getMaps(axios, params)}
                skeleton={{
                  amount: 20,
                  item: <Skeleton className="h-preview-height" />,
                }}
              >
                {({ id, name }) => <ServerMapCard key={id} id={id} name={name} isAdded={added.includes(id)} mutate={mutate} />}
              </InfinitePage>
            </ListLayout>
            <GridLayout>
              <GridPaginationList
                paramSchema={ItemPaginationQuery}
                queryKey={['maps']}
                queryFn={getMaps}
                skeleton={{
                  amount: 20,
                  item: <Skeleton className="h-preview-height" />,
                }}
              >
                {({ id, name }) => <ServerMapCard key={id} id={id} name={name} isAdded={added.includes(id)} mutate={mutate} />}
              </GridPaginationList>
            </GridLayout>
          </ScrollContainer>
          <div className="flex justify-end gap-2">
            <PaginationLayoutSwitcher />
            <GridLayout>
              <PaginationNavigator numberOfItems={getMapCount} queryKey={['maps', 'total']} />
            </GridLayout>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ServerMapCardProps = {
  name: string;
  id: string;
  isAdded: boolean;
  mutate: (id: string) => void;
};

function ServerMapCard({ id, name, isAdded, mutate }: ServerMapCardProps) {
  return (
    <Button
      className={cn('hover:zoom-in-110 relative h-full max-h-preview-height min-h-preview-height w-full overflow-hidden rounded-md border-2 border-border p-0 text-start', {
        'border border-success': isAdded,
      })}
      variant="icon"
      title={name}
      onClick={() => mutate(id)}
    >
      <h3 className="absolute top-0 w-full overflow-hidden p-2 text-center backdrop-brightness-[20%]">{name}</h3>
      <footer className="absolute bottom-0 w-full overflow-hidden p-2 text-center backdrop-brightness-[20%]"></footer>
      <PreviewImage src={`${env.url.image}/map-previews/${id}${env.imageFormat}`} errorSrc={`${env.url.api}/maps/${id}/image`} alt={name} />
    </Button>
  );
}
