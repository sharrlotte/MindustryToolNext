'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import CopyButton from '@/components/button/copy-button';
import DeleteButton from '@/components/button/delete-button';
import DownloadButton from '@/components/button/download-button';
import TakeDownButton from '@/components/button/take-down-button';
import {
  Detail,
  DetailActions,
  DetailDescription,
  DetailHeader,
  DetailImage,
  DetailInfo,
  DetailTagsCard,
  DetailTitle,
} from '@/components/detail/detail';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import LikeCount from '@/components/like/like-count';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';
import env from '@/constant/env';
import { useSession } from '@/context/session-context';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import ProtectedElement from '@/layout/protected-element';
import { useI18n } from '@/locales/client';
import deleteMap from '@/query/map/delete-map';
import putRemoveMap from '@/query/map/put-remove-map';
import { MapDetail } from '@/types/response/MapDetail';

import { LinkIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';

type MapDetailCardProps = {
  map: MapDetail;
};

export default function MapDetailCard({ map }: MapDetailCardProps) {
  const link = `${env.url.base}/maps/${map.id}`;

  const axios = useClientAPI();
  const { deleteById, invalidateByKey } = useQueriesData();
  const { back } = useRouter();
  const { toast } = useToast();
  const { session } = useSession();

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

  const { mutate: deleteMapById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteMap(axios, id),
    onSuccess: () => {
      deleteById(['map-uploads'], map.id);
      invalidateByKey(['total-map-uploads']);
      invalidateByKey(['maps']);
      back();
      toast({
        title: t('delete-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('delete-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const isLoading = isDeleting || isRemoving;

  return (
    <Detail>
      <DetailInfo>
        <div className="relative">
          <CopyButton
            className="absolute left-1 top-1"
            variant="ghost"
            data={link}
            content={link}
          >
            <LinkIcon className="h-5 w-5" />
          </CopyButton>
          <DetailImage
            src={`${env.url.image}/maps/${map.id}.png`}
            errorSrc={`${env.url.api}/maps/${map.id}/image`}
            alt={map.name}
          />
        </div>
        <DetailHeader>
          <DetailTitle>{map.name}</DetailTitle>
          <IdUserCard id={map.authorId} />
          <div className="flex items-end gap-2">
            <span>{t('verified-by')}</span>
            <IdUserCard id={map.verfierId} />
          </div>
          <DetailDescription>{map.description}</DetailDescription>
          <DetailTagsCard tags={map.tags} />
        </DetailHeader>
      </DetailInfo>
      <DetailActions className="flex justify-between">
        <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
          <DownloadButton
            href={`${env.url.api}/maps/${map.id}/download`}
            fileName={`{${map.name}}.msav`}
          />
          <LikeComponent
            itemId={map.itemId}
            initialLikeCount={map.like}
            initialLikeData={map.userLike}
          >
            <LikeButton />
            <LikeCount />
            <DislikeButton />
          </LikeComponent>
          <ProtectedElement
            session={session}
            ownerId={map.authorId}
            show={map.status === 'VERIFIED'}
          >
            <TakeDownButton
              isLoading={isRemoving}
              description={`Take down this map: ${map.name}`}
              onClick={() => removeMap(map.id)}
            />
          </ProtectedElement>
          <ProtectedElement session={session} ownerId={map.authorId}>
            <DeleteButton
              description={`${t('delete')} ${map.name}`}
              isLoading={isLoading}
              onClick={() => deleteMapById(map.id)}
            />
          </ProtectedElement>
        </div>
        <BackButton />
      </DetailActions>
    </Detail>
  );
}
