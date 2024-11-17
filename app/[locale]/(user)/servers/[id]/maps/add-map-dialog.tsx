import { useRef, useState } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import LoadingScreen from '@/components/common/loading-screen';
import { PreviewImage } from '@/components/common/preview';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import NameTagSearch from '@/components/search/name-tag-search';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import env from '@/constant/env';
import { useTags } from '@/context/tags-context.client';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useSearchQuery from '@/hooks/use-search-query';
import { useToast } from '@/hooks/use-toast';
import { getMaps } from '@/query/map';
import { ItemPaginationQuery } from '@/query/search-query';
import { createInternalServerMap } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type AddMapDialogProps = {
  serverId: string;
};

export function AddMapDialog({ serverId }: AddMapDialogProps) {
  const { toast } = useToast();
  const {
    searchTags: { map },
  } = useTags();
  const [show, setShow] = useState(false);
  const axios = useClientApi();

  const { invalidateByKey } = useQueriesData();

  const params = useSearchQuery(ItemPaginationQuery);
  const ref = useRef<HTMLDivElement | null>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: (mapId: string) => createInternalServerMap(axios, serverId, { mapId }),
    onError: (error) => {
      toast({
        title: <Tran text="upload.fail" />,
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['servers', serverId, 'maps']);
    },
  });

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button className="ml-auto" title="Add map" variant="secondary">
          <Tran text="internal-server.add-map" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex w-full flex-col overflow-hidden p-4">
        <DialogTitle>
          <Tran text="internal-server.select-map" />
        </DialogTitle>
        <div className="flex h-full flex-col justify-start gap-2 overflow-hidden">
          <NameTagSearch tags={map} />
          <ScrollContainer className="flex h-full w-full flex-col gap-2 overflow-y-auto" ref={ref}>
            <InfinitePage
              params={params}
              queryKey={['maps']}
              getFunc={(axios, params) => getMaps(axios, params)}
              container={() => ref.current}
              skeleton={{
                amount: 20,
                item: <Skeleton className="h-preview-height" />,
              }}
            >
              {({ id, name }) => (
                <Button
                  className="hover:border-button relative h-full max-h-preview-height min-h-preview-height w-full overflow-hidden rounded-md border-2 border-border p-0 text-start"
                  variant="outline"
                  key={id}
                  title={name}
                  onClick={() => mutate(id)}
                >
                  <h3 className="absolute top-0 w-full overflow-hidden p-2 text-center backdrop-brightness-50">{name}</h3>
                  <PreviewImage src={`${env.url.image}/map-previews/${id}${env.imageFormat}`} errorSrc={`${env.url.api}/maps/${id}/image`} alt={name} />
                </Button>
              )}
            </InfinitePage>
          </ScrollContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
