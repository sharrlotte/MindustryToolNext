import InfinitePage from '@/components/common/infinite-page';
import LoadingScreen from '@/components/common/loading-screen';
import { PreviewImage } from '@/components/common/preview';
import NameTagSearch from '@/components/search/name-tag-search';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useSearchPageParams from '@/hooks/use-plugin-search-params';
import useQueriesData from '@/hooks/use-queries-data';
import { useSearchTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';
import { getMaps } from '@/query/map';
import { createInternalServerMap } from '@/query/server';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

type AddMapDialogProps = {
  serverId: string;
};

export function AddMapDialog({ serverId }: AddMapDialogProps) {
  const { toast } = useToast();
  const { map } = useSearchTags();
  const [show, setShow] = useState(false);
  const axios = useClientApi();
  const t = useI18n();

  const { invalidateByKey } = useQueriesData();

  //TODO: Fix search
  const params = useSearchPageParams();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: (mapId: string) =>
      createInternalServerMap(axios, serverId, { mapId }),
    onError: (error) => {
      toast({
        title: t('server.upload-fail'),
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
        <Button
          className="ml-auto"
          title={t('internal-server.add-map')}
          variant="secondary"
        >
          {t('internal-server.add-map')}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex w-full flex-col overflow-hidden p-6">
        <DialogTitle>{t('internal-server.select-map')}</DialogTitle>
        <div className="flex h-full flex-col justify-start gap-2 overflow-hidden">
          <NameTagSearch tags={map} />
          <div
            className="flex h-full w-full flex-col gap-2 overflow-y-auto p-2"
            ref={(ref) => setContainer(ref)}
          >
            <InfinitePage
              params={params}
              queryKey={['maps']}
              getFunc={(axios, params) => getMaps(axios, params)}
              container={() => container}
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
                  <h3 className="absolute top-0 w-full overflow-hidden p-2 text-center backdrop-brightness-50">
                    {name}
                  </h3>
                  <PreviewImage
                    src={`${env.url.image}/map-previews/${id}.png`}
                    errorSrc={`${env.url.api}/maps/${id}/image`}
                    alt={name}
                  />
                </Button>
              )}
            </InfinitePage>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
