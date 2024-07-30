/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';

import LoadingWrapper from '@/components/common/loading-wrapper';
import { DetailDescription, DetailTitle } from '@/components/detail/detail';
import NameTagSelector from '@/components/search/name-tag-selector';
import { Button } from '@/components/ui/button';
import IdUserCard from '@/components/user/id-user-card';
import UserCard from '@/components/user/user-card';
import { PNG_IMAGE_PREFIX } from '@/constant/constant';
import { useSession } from '@/context/session-context';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useUploadTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import postMap from '@/query/map/post-map';
import postMapPreview from '@/query/map/post-map-preview';
import MapPreviewRequest from '@/types/request/MapPreviewRequest';
import PostMapRequest from '@/types/request/PostMapRequest';
import MapPreviewResponse from '@/types/response/MapPreviewResponse';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

import { useMutation } from '@tanstack/react-query';

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

export default function Page() {
  const axios = useClientAPI();
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<MapPreviewResponse>();
  const { session } = useSession();

  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { map } = useUploadTags();
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();

  const t = useI18n();

  const { mutate: getMapPreview, isPending: isLoadingMapPreview } = useMutation(
    {
      mutationFn: (data: MapPreviewRequest) => postMapPreview(axios, data),
      onSuccess: (data) => setPreview(data),
      onError(error) {
        toast({
          title: t('upload.get-preview-fail'),
          description: error.message,
          variant: 'destructive',
        });
        setFile(undefined);
      },
    },
  );

  const { mutate: postNewMap, isPending: isLoadingPostMap } = useMutation({
    mutationFn: (data: PostMapRequest) => postMap(axios, data),
    onSuccess: () => {
      toast({
        title: t('upload.success'),
        variant: 'success',
      });
      setFile(undefined);
      setPreview(undefined);
      setSelectedTags([]);
      invalidateByKey(['map-uploads']);
      invalidateByKey(['total-map-uploads']);
    },
    onError(error) {
      toast({
        title: t('upload.fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const isLoading = isLoadingPostMap || isLoadingMapPreview;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length <= 0 || !files[0]) {
      toast({
        title: t('upload.no-file'),
        variant: 'destructive',
      });
      return;
    }
    const filename = files[0].name;
    const extension = filename.split('.').pop();

    if (extension !== 'msav') {
      toast({
        title: t('upload.invalid-map-file'),
        variant: 'destructive',
      });
      return;
    }

    setPreview(undefined);
    setFile(files[0]);
  }

  function handleSubmit() {
    if (!file || isLoading || !preview) {
      return;
    }

    postNewMap({ ...preview, file, tags: TagGroups.toString(selectedTags) });
  }

  useEffect(() => {
    if (file) {
      getMapPreview({ file });
    }
  }, [file, getMapPreview]);

  function checkUploadRequirement() {
    if (!file) return t('upload.no-file');

    return true;
  }

  const uploadCheck = checkUploadRequirement();

  return (
    <div className="flex h-full w-full flex-col justify-between gap-2 overflow-y-auto rounded-md">
      <div className="flex flex-1 flex-col gap-2 rounded-md bg-card p-2">
        <section className="flex min-h-10 flex-row flex-wrap gap-2 md:flex-row md:items-start">
          <label htmlFor="file" className="hover:cursor-pointer">
            <LoadingWrapper isLoading={isLoadingMapPreview}>
              {preview ? (
                <Image
                  loader={({ src }) => src}
                  src={PNG_IMAGE_PREFIX + preview.image.trim()}
                  alt="Map"
                  width={512}
                  height={512}
                />
              ) : (
                <Button
                  className="text-sm"
                  variant="primary"
                  title={t('upload.select-map')}
                  asChild
                >
                  <span title={t('upload.select-map')}>
                    {t('upload.select-map')}
                  </span>
                </Button>
              )}
            </LoadingWrapper>
          </label>
          <input
            id="file"
            type="file"
            hidden
            accept=".msav"
            disabled={isLoading}
            key={file?.name}
            onChange={(event) => handleFileChange(event)}
          />
          {preview && (
            <section className="flex flex-col gap-2">
              <DetailTitle>{preview.name}</DetailTitle>
              {session ? (
                <UserCard user={session} />
              ) : (
                <IdUserCard id="community" />
              )}
              <DetailDescription>{preview.description}</DetailDescription>
              <NameTagSelector
                tags={map}
                value={selectedTags}
                onChange={setSelectedTags}
              />
            </section>
          )}
        </section>
      </div>
      <div className="flex flex-col items-end justify-center rounded-md bg-card p-2">
        <Button
          className="w-fit"
          variant="primary"
          title={t('upload')}
          onClick={() => handleSubmit()}
          disabled={isLoading || uploadCheck !== true}
        >
          <LoadingWrapper isLoading={isLoading}>
            {uploadCheck === true ? t('upload') : uploadCheck}
          </LoadingWrapper>
        </Button>
      </div>
    </div>
  );
}
