/* eslint-disable @next/next/no-img-element */
'use client';

import Detail from '@/components/detail/detail';
import NameTagSelector from '@/components/search/name-tag-selector';
import { Button } from '@/components/ui/button';
import IdUserCard from '@/components/user/id-user-card';
import UserCard from '@/components/user/user-card';
import { PNG_IMAGE_PREFIX } from '@/constant/constant';
import useClientAPI from '@/hooks/use-client';
import useTags from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import postMap from '@/query/map/post-map';
import postMapPreview from '@/query/map/post-map-preview';
import PostMapRequest from '@/types/request/PostMapRequest';
import MapPreviewRequest from '@/types/request/MapPreviewRequest';
import MapPreviewResponse from '@/types/response/MapPreviewResponse';
import TagGroup from '@/types/response/TagGroup';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useEffect, useState } from 'react';
import LoadingWrapper from '@/components/common/loading-wrapper';

export default function Page() {
  const { axios } = useClientAPI();
  const [data, setData] = useState<File>();
  const [preview, setPreview] = useState<MapPreviewResponse>();
  const { data: session } = useSession();
  const user = session?.user;
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { map } = useTags();
  const { toast } = useToast();

  const { mutate: getMapPreview, isPending: isLoadingMapPreview } = useMutation(
    {
      mutationFn: (data: MapPreviewRequest) => postMapPreview(axios, data),
      onSuccess: (data) => setPreview(data),
      onError(error) {
        toast({
          title: 'Failed to get preview',
          description: error.message,
          variant: 'destructive',
        });
        setData(undefined);
      },
    },
  );

  const { mutate: postNewMap, isPending: isLoadingPostMap } = useMutation({
    mutationFn: (data: PostMapRequest) => postMap(axios, data),
    onSuccess: () => {
      toast({
        title: 'Upload map success',
        variant: 'success',
      });
    },
    onError(error) {
      toast({
        title: 'Upload map failed',
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
        title: 'No file selected',
        variant: 'destructive',
      });
      return;
    }
    const filename = files[0].name;
    const extension = filename.split('.').pop();

    if (extension !== 'msav') {
      toast({
        title: 'Invalid file extension, file must end with .msav',
        variant: 'destructive',
      });
      return;
    }

    setData(files[0]);
  }

  function handleSubmit() {
    if (!data || isLoading) {
      return;
    }

    postNewMap({ data, tags: selectedTags });
  }

  useEffect(() => {
    if (data) {
      getMapPreview({ data });
    }
  }, [data, getMapPreview]);

  function checkUploadRequirement() {
    if (!data) return 'No map data';

    return true;
  }

  const uploadCheck = checkUploadRequirement();

  return (
    <div className="flex h-full w-full flex-col justify-between gap-2 overflow-y-auto rounded-md pr-1">
      <div className="flex flex-col gap-2 rounded-md bg-card p-2">
        <section className="flex min-h-10 flex-row flex-wrap gap-2">
          <label className="button" htmlFor="file">
            {preview ? (
              <img src={PNG_IMAGE_PREFIX + preview.image} alt="Error" />
            ) : (
              <Button title="Select file" asChild>
                <span title="Select map">Select map</span>
              </Button>
            )}
          </label>
          <input
            id="file"
            type="file"
            hidden
            accept=".msav"
            disabled={isLoading}
            onChange={(event) => handleFileChange(event)}
          />
          {preview && (
            <section className="flex flex-col gap-2">
              <Detail.Title>{preview.name}</Detail.Title>
              {user ? <UserCard user={user} /> : <IdUserCard id="community" />}
              <Detail.Description>{preview.description}</Detail.Description>
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
          title="Upload"
          onClick={() => handleSubmit()}
          disabled={isLoading || uploadCheck !== true}
        >
          <LoadingWrapper isLoading={isLoading}>
            {uploadCheck === true ? 'Upload' : uploadCheck}
          </LoadingWrapper>
        </Button>
      </div>
    </div>
  );
}
