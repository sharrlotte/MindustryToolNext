import InfinitePage from '@/components/common/infinite-page';
import NameTagSearch from '@/components/search/name-tag-search';
import { Skeleton } from '@/components/ui/skeleton';
import useClientApi from '@/hooks/use-client';
import useSearchPageParams from '@/hooks/use-plugin-search-params';
import useQueriesData from '@/hooks/use-queries-data';
import { useSearchTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';
import { getPlugins } from '@/query/plugin';
import { createInternalServerPlugin } from '@/query/server';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type AddPluginDialogProps = {
  serverId: string;
};

export function AddPluginDialog({ serverId }: AddPluginDialogProps) {
  const { toast } = useToast();
  const { plugin } = useSearchTags();
  const [show, setShow] = useState(false);
  const axios = useClientApi();
  const t = useI18n();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const params = useSearchPageParams();
  const { invalidateByKey } = useQueriesData();

  const { mutate } = useMutation({
    mutationFn: (pluginId: string) =>
      createInternalServerPlugin(axios, serverId, { pluginId }),
    onError: (error) => {
      toast({
        title: t('server.upload-fail'),
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
        <Button
          className="ml-auto"
          title={t('internal-server.add-plugin')}
          variant="secondary"
        >
          {t('internal-server.add-plugin')}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full p-6">
        <DialogTitle>{t('internal-server.select-plugin')}</DialogTitle>
        <div className="flex h-full flex-col justify-start gap-2 overflow-hidden">
          <NameTagSearch tags={plugin} />
          <div
            className="flex h-full w-full flex-col gap-2 overflow-y-auto p-2"
            ref={(ref) => setContainer(ref)}
          >
            <InfinitePage
              params={params}
              queryKey={['plugin']}
              getFunc={(axios, params) => getPlugins(axios, params)}
              container={() => container}
              skeleton={{
                amount: 20,
                item: <Skeleton className="h-20" />,
              }}
            >
              {({ id, name, description }) => (
                <Button
                  className="flex h-fit w-full flex-col items-start justify-start rounded-md border border-border p-2 text-start hover:bg-brand"
                  variant="outline"
                  key={id}
                  title={name}
                  onClick={() => mutate(id)}
                >
                  <h3>{name}</h3>
                  <span>{description}</span>
                </Button>
              )}
            </InfinitePage>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
