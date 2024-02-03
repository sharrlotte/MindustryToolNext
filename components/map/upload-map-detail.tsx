'use client';

import Detail from '@/components/detail/detail';
import BackButton from '@/components/ui/back-button';
import CopyButton from '@/components/button/copy-button';
import env from '@/constant/env';
import { useToast } from '@/hooks/use-toast';
import { Map } from '@/types/response/Map';
import React, { HTMLAttributes, useState } from 'react';
import DownloadButton from '@/components/button/download-button';
import IdUserCard from '@/components/user/id-user-card';
import useClientAPI from '@/hooks/use-client';
import { useMutation } from '@tanstack/react-query';
import postVerifyMap from '@/query/map/post-verify-map';
import VerifyMapRequest from '@/types/request/VerifyMapRequest';
import getMapData from '@/query/map/get-map-data';
import TagGroup from '@/types/response/TagGroup';
import NameTagSelector from '@/components/search/name-tag-selector';
import useTags from '@/hooks/use-tags';
import { useRouter } from 'next/navigation';
import deleteMap from '@/query/map/delete-map';
import useQueriesData from '@/hooks/use-queries-data';
import VerifyButton from '@/components/button/verify-button';
import DeleteButton from '@/components/button/delete-button';

type UploadMapDetailProps = HTMLAttributes<HTMLDivElement> & {
  map: Map;
};

export default function UploadMapDetail({ map }: UploadMapDetailProps) {
  const { toast } = useToast();
  const { back } = useRouter();
  const { axios } = useClientAPI();
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { map: mapTags } = useTags();
  const { deleteById, invalidateByKey } = useQueriesData();

  const { mutate: verifyMap, isPending: isVerifying } = useMutation({
    mutationFn: (data: VerifyMapRequest) => postVerifyMap(axios, data),
    onSuccess: () => {
      deleteById(['map-uploads'], map.id);
      back();
      toast({
        title: 'Verify map successfully',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to verify map',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['map-uploads']);
    },
  });

  const { mutate: deleteMapById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteMap(axios, id),
    onSuccess: () => {
      deleteById(['map-uploads'], map.id);
      invalidateByKey(['map-uploads']);
      back();
      toast({
        title: 'Delete map successfully',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete map',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['map-uploads']);
    },
  });

  const isLoading = isVerifying || isDeleting;
  const link = `${env.url.base}/maps/${map.id}`;

  const getData = async () => {
    const { dismiss } = toast({
      title: 'Coping',
      content: 'Downloading data from server',
    });
    const result = await getMapData(axios, map.id);
    dismiss();
    return result;
  };

  return (
    <Detail>
      <Detail.Info>
        <div className="relative">
          <CopyButton
            className="absolute left-1 top-1 "
            title="Copy"
            variant="ghost"
            data={link}
            content={link}
          />
          <Detail.Image
            src={`${env.url.image}/maps/${map.id}.png`}
            errorSrc={`${env.url.api}/maps/${map.id}/image`}
            alt={map.name}
          />
          Map
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
        <div className="flex gap-1">
          <CopyButton
            className="aspect-square h-9 w-9"
            title="Copy"
            variant="outline"
            content={`Copied map ${map.name}`}
            data={getData}
          />
          <DownloadButton
            className="aspect-square h-9 w-9"
            href={`${env.url.api}/maps/${map.id}/download`}
          />
          <DeleteButton
            description={`Delete this map: ${map.name}`}
            isLoading={isLoading}
            onClick={() => deleteMapById(map.id)}
          />
          <VerifyButton
            description={`Verify this map: ${map.name}`}
            isLoading={isLoading}
            onClick={() => verifyMap({ id: map.id, tags: selectedTags })}
          />
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
