import { useRef, useState } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import NameTagSearch from '@/components/search/name-tag-search';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useTags } from '@/context/tags-context.client';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useSearchQuery from '@/hooks/use-search-query';
import { useToast } from '@/hooks/use-toast';
import { getPlugins } from '@/query/plugin';
import { ItemPaginationQuery } from '@/query/search-query';
import { createInternalServerPlugin } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type AddPluginDialogProps = {
  serverId: string;
};

export function AddPluginDialog({ serverId }: AddPluginDialogProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const {
    searchTags: { plugin },
  } = useTags();
  const [show, setShow] = useState(false);
  const axios = useClientApi();

  const params = useSearchQuery(ItemPaginationQuery);
  const { invalidateByKey } = useQueriesData();

  const { mutate } = useMutation({
    mutationFn: (pluginId: string) => createInternalServerPlugin(axios, serverId, { pluginId }),
    onError: (error) => {
      toast({
        title: <Tran text="upload.fail" />,
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      setShow(false);
    },
    onSettled: () => {
      invalidateByKey(['servers', serverId, 'plugins']);
    },
  });

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button className="ml-auto" title="Add plugin" variant="secondary">
          <Tran text="internal-server.add-plugin" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex w-full flex-col overflow-hidden p-4">
        <DialogTitle>
          <Tran text="internal-server.select-plugin" />
        </DialogTitle>
        <div className="flex h-full flex-col justify-start gap-2 overflow-hidden">
          <NameTagSearch tags={plugin} />
          <ScrollContainer className="flex h-full w-full flex-col gap-2 overflow-y-auto" ref={ref}>
            <InfinitePage
              params={params}
              queryKey={['plugin']}
              getFunc={(axios, params) => getPlugins(axios, params)}
              container={() => ref.current}
              skeleton={{
                amount: 20,
                item: <Skeleton className="h-20" />,
              }}
            >
              {({ id, name, description }) => (
                <Button
                  className="relative flex h-32 w-full flex-col items-start justify-start gap-2 overflow-hidden rounded-md border border-border bg-card p-4 text-start hover:bg-brand/70"
                  variant="outline"
                  key={id}
                  onClick={() => mutate(id)}
                >
                  <h2 className="line-clamp-1 w-full text-ellipsis whitespace-normal text-nowrap">{name}</h2>
                  <span className="line-clamp-2 w-full overflow-hidden text-ellipsis text-wrap text-muted-foreground">{description}</span>{' '}
                </Button>
              )}
            </InfinitePage>
          </ScrollContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
