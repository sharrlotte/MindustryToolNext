import { useRef, useState } from 'react';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import LoadingScreen from '@/components/common/loading-screen';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import NameTagSearch from '@/components/search/name-tag-search';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { useTags } from '@/context/tags-context.client';
import useClientApi from '@/hooks/use-client';
import useClientQuery from '@/hooks/use-client-query';
import useQueriesData from '@/hooks/use-queries-data';
import useSearchQuery from '@/hooks/use-search-query';
import { useToast } from '@/hooks/use-toast';
import { cn, omit } from '@/lib/utils';
import { getPluginCount, getPlugins } from '@/query/plugin';
import { ItemPaginationQuery } from '@/query/search-query';
import { createInternalServerPlugin } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type AddPluginDialogProps = {
  serverId: string;
};

export default function AddPluginDialog({ serverId }: AddPluginDialogProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [added, setAdded] = useState<string[]>([]);
  const { toast } = useToast();
  const {
    searchTags: { plugin },
  } = useTags();
  const [show, setShow] = useState(false);
  const axios = useClientApi();

  const params = useSearchQuery(ItemPaginationQuery);
  const { invalidateByKey } = useQueriesData();

  const { data } = useClientQuery({
    queryKey: ['plugins', 'total', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => getPluginCount(axios, params),
    placeholderData: 0,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (pluginId: string) => createInternalServerPlugin(axios, serverId, { pluginId }),
    onSuccess: (_, pluginId) => {
      toast({
        title: <Tran text="interval-server.add-plugin-success" />,
        variant: 'success',
      });
      setAdded((prev) => [...prev, pluginId]);
    },
    onError: (error) => {
      toast({
        title: <Tran text="interval-server.add-plugin-fail" />,
        description: error.message,
        variant: 'destructive',
      });
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
      <DialogContent className="flex w-full flex-col max-w-full max-h-full h-full overflow-hidden p-4">
        <DialogTitle>
          <Tran text="internal-server.select-plugin" />
        </DialogTitle>
        {isPending && <LoadingScreen />}
        <div className="flex h-full flex-col justify-start gap-2 overflow-hidden">
          <NameTagSearch tags={plugin} />
          <div className="flex justify-between">
            <Tran text="found" args={{ number: data }} />
            <PaginationLayoutSwitcher />
          </div>
          <ListLayout>
            <ScrollContainer className="flex h-full w-full flex-col gap-2 overflow-y-auto" ref={ref}>
              <InfinitePage
                params={params}
                queryKey={['plugin']}
                queryFn={(axios, params) => getPlugins(axios, params)}
                container={() => ref.current}
                skeleton={{
                  amount: 20,
                  item: <Skeleton className="h-20" />,
                }}
              >
                {({ id, name, description }) => <ServerPluginCard key={id} id={id} name={name} description={description} isAdded={added.includes(id)} mutate={mutate} />}
              </InfinitePage>
            </ScrollContainer>
          </ListLayout>
          <GridLayout>
            <GridPaginationList
              params={params}
              queryKey={['plugin']}
              queryFn={getPlugins}
              skeleton={{
                amount: 20,
                item: <Skeleton className="h-20" />,
              }}
            >
              {({ id, name, description }) => <ServerPluginCard key={id} id={id} name={name} description={description} isAdded={added.includes(id)} mutate={mutate} />}
            </GridPaginationList>
          </GridLayout>
          <div className="flex justify-end">
            <PaginationNavigator numberOfItems={data} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ServerPluginCardProps = {
  id: string;
  name: string;
  description: string;
  isAdded: boolean;
  mutate: (id: string) => void;
};

function ServerPluginCard({ id, name, description, isAdded, mutate }: ServerPluginCardProps) {
  return (
    <Button
      className={cn('relative flex h-32 w-full flex-col items-start justify-start gap-2 overflow-hidden rounded-md border border-border bg-card p-4 text-start hover:bg-brand/70', {
        'border border-success': isAdded,
      })}
      variant="outline"
      key={id}
      onClick={() => mutate(id)}
    >
      <h2 className="line-clamp-1 w-full text-ellipsis whitespace-normal text-nowrap">{name}</h2>
      <span className="line-clamp-2 w-full overflow-hidden text-ellipsis text-wrap text-muted-foreground">{description}</span>{' '}
    </Button>
  );
}
