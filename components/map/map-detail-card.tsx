'use client';

import Detail from '@/components/detail/detail';
import LikeComponent from '@/components/like/like-component';
import BackButton from '@/components/ui/back-button';
import CopyButton from '@/components/button/copy-button';
import env from '@/constant/env';
import React from 'react';
import DownloadButton from '@/components/button/download-button';
import IdUserCard from '@/components/user/id-user-card';
import { MapDetail } from '@/types/response/MapDetail';
import LikeButton from '@/components/like/like-button';
import LikeCount from '@/components/like/like-count';
import DislikeButton from '@/components/like/dislike-button';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import putRemoveMap from '@/query/map/put-remove-map';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import ProtectedElement from '@/layout/protected-element';
import TakeDownButton from '@/components/button/take-down-button';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/locales/client';

type MapDetailCardProps = {
  map: MapDetail;
  padding?: boolean;
};

export default function MapDetailCard({ map, padding }: MapDetailCardProps) {
  const link = `${env.url.base}/maps/${map.id}`;

  const { axios } = useClientAPI();
  const { deleteById, invalidateByKey } = useQueriesData();
  const { back } = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const t = useI18n();

  const { mutate: removeMap, isPending: isRemoving } = useMutation({
    mutationFn: (id: string) => putRemoveMap(axios, id),
    onSuccess: () => {
      deleteById(['maps'], map.id);
      invalidateByKey(['map-uploads']);
      back();
      toast({
        title: t('take-down-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('take-down-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <Detail padding={padding}>
      <Detail.Info>
        <div className="relative">
          <CopyButton
            className="absolute left-1 top-1"
            variant="ghost"
            data={link}
            content={link}
          />
          <Detail.Image
            src={`${env.url.image}/maps/${map.id}.png`}
            errorSrc={`${env.url.api}/maps/${map.id}/image`}
            alt={map.name}
          />
        </div>
        <Detail.Header>
          <Detail.Title>{map.name}</Detail.Title>
          <IdUserCard id={map.authorId} />
          <div className="flex items-end gap-2">
            <span>{t('verified-by')}</span>
            <IdUserCard id={map.verifyAdmin} />
          </div>
          <Detail.Description>{map.description}</Detail.Description>
          <Detail.Tags tags={map.tags} />
        </Detail.Header>
      </Detail.Info>
      <Detail.Actions className="flex justify-between">
        <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
          <DownloadButton href={`${env.url.api}/maps/${map.id}/download`} />
          <LikeComponent
            targetId={map.id}
            targetType="MAPS"
            initialLikeCount={map.like}
            initialLikeData={map.userLike}
          >
            <LikeButton />
            <LikeCount />
            <DislikeButton />
          </LikeComponent>
          <ProtectedElement session={session} ownerId={map.authorId}>
            <TakeDownButton
              isLoading={isRemoving}
              description={`Take down this map: ${map.name}`}
              onClick={() => removeMap(map.id)}
            />
          </ProtectedElement>
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
