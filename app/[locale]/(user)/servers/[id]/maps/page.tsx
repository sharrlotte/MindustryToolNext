'use client';

import React, { useState } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import LoadingScreen from '@/components/common/loading-screen';
import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import { PreviewImage } from '@/components/common/preview';
import NameTagSearch from '@/components/search/name-tag-search';
import InternalServerMapCard from '@/components/server/internal-server-map-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import env from '@/constant/env';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useSafeParam from '@/hooks/use-safe-param';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import createInternalServerMap from '@/query/server/post-internal-server-map';

import { useMutation } from '@tanstack/react-query';
import getInternalServerMaps from '@/query/server/get-internal-server-maps';
import { getMaps } from '@/query/map';

export default function ServerMaps() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const id = useSafeParam().get('id');

  return (
    <div className="flex flex-col gap-2 overflow-hidden p-4">
      <div className=" flex justify-end bg-card p-2">
        <AddMapDialog serverId={id} />
      </div>
      <div
        className="flex h-full w-full flex-col gap-2 overflow-y-auto"
        ref={(ref) => setContainer(ref)}
      >
        <ResponsiveInfiniteScrollGrid
          params={{ page: 0, size: 20 }}
          queryKey={['servers', id, 'maps']}
          getFunc={(axios, params) => getInternalServerMaps(axios, id, params)}
          container={() => container}
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
          itemMinWidth={320}
          itemMinHeight={352}
          contentOffsetHeight={112}
          gap={8}
        >
          {(data) => <InternalServerMapCard key={data.mapId} map={data} />}
        </ResponsiveInfiniteScrollGrid>
      </div>
    </div>
  );
}

type AddMapDialogProps = {
  serverId: string;
};

function AddMapDialog({ serverId }: AddMapDialogProps) {
  const { toast } = useToast();
  const { map } = useSearchTags();
  const [show, setShow] = useState(false);
  const axios = useClientAPI();
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
    onSuccess: () => {
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
