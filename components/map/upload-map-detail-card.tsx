'use client';

import Detail from '@/components/detail/detail';
import BackButton from '@/components/ui/back-button';
import CopyButton from '@/components/button/copy-button';
import env from '@/constant/env';
import { useToast } from '@/hooks/use-toast';
import { MapDetail } from '@/types/response/MapDetail';
import React, { useEffect, useState } from 'react';
import DownloadButton from '@/components/button/download-button';
import IdUserCard from '@/components/user/id-user-card';
import useClientAPI from '@/hooks/use-client';
import { useMutation } from '@tanstack/react-query';
import postVerifyMap from '@/query/map/post-verify-map';
import VerifyMapRequest from '@/types/request/VerifyMapRequest';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';
import NameTagSelector from '@/components/search/name-tag-selector';
import useTags from '@/hooks/use-tags';
import { useRouter } from 'next/navigation';
import deleteMap from '@/query/map/delete-map';
import useQueriesData from '@/hooks/use-queries-data';
import VerifyButton from '@/components/button/verify-button';
import DeleteButton from '@/components/button/delete-button';
import { useI18n } from '@/locales/client';

type UploadMapDetailCardProps = {
  map: MapDetail;
};

export default function UploadMapDetailCard({ map }: UploadMapDetailCardProps) {
  const { toast } = useToast();
  const { back } = useRouter();
  const { axios } = useClientAPI();
  const { map: mapTags } = useTags();
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { deleteById, invalidateByKey } = useQueriesData();
  const t = useI18n();

  const { mutate: verifyMap, isPending: isVerifying } = useMutation({
    mutationFn: (data: VerifyMapRequest) => postVerifyMap(axios, data),
    onSuccess: () => {
      deleteById(['map-uploads'], map.id);
      invalidateByKey(['total-map-uploads']);
      back();
      toast({
        title: t('verify-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('verify-fail'),
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

  useEffect(() => {
    setSelectedTags(TagGroups.parseString(map.tags, mapTags));
  }, [map.tags, mapTags]);

  const isLoading = isVerifying || isDeleting;
  const link = `${env.url.base}/maps/${map.id}`;

  return (
    <Detail>
      <Detail.Info>
        <div className="relative">
          <CopyButton
            className="absolute left-1 top-1 "
            variant="ghost"
            data={link}
            content={link}
          />
          <Detail.Image
            src={`${env.url.image}/maps/${map.id}.png`}
            errorSrc={`${env.url.api}/maps/${map.id}/image`}
            alt={map.name}
          />
          {t('map')}
        </div>
        <Detail.Header>
          <Detail.Title>{map.name}</Detail.Title>
          <IdUserCard id={map.authorId} />
          <Detail.Description>{map.description}</Detail.Description>
          <NameTagSelector
            tags={mapTags}
            value={selectedTags}
            onChange={setSelectedTags}
          />
        </Detail.Header>
      </Detail.Info>
      <Detail.Actions className="flex justify-between">
        <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
          <DownloadButton
            href={`${env.url.api}/maps/${map.id}/download`}
            fileName={`{${map.name}}.msav`}
          />
          <DeleteButton
            description={`${t('delete')} ${map.name}`}
            isLoading={isLoading}
            onClick={() => deleteMapById(map.id)}
          />
          <VerifyButton
            description={`${t('verify')} ${map.name}`}
            isLoading={isLoading}
            onClick={() =>
              verifyMap({ id: map.id, tags: TagGroups.toString(selectedTags) })
            }
          />
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
