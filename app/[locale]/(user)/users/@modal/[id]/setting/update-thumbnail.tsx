'use client';

import { useMemo, useState } from 'react';

import { ImageIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { getUser, updateThumbnail } from '@/query/user';

import { useMutation, useQuery } from '@tanstack/react-query';
import { acceptedImageFormats } from '@/constant/constant';

type UpdateThumbnailProps = {
  id: string;
};

export default function UpdateThumbnail({ id }: UpdateThumbnailProps) {
  const axios = useClientApi();
  const [file, setFile] = useState<File>();

  const { data } = useQuery({
    queryKey: ['users', id],
    queryFn: () => getUser(axios, { id }),
  });

  const imageUrl = useMemo(() => (file ? URL.createObjectURL(file) : data?.thumbnail ? `${data.thumbnail}` : undefined), [file, data?.thumbnail]);

  function handleFilePick(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files;

    if (!files || files.length === 0) {
      return;
    }

    setFile(files[0]);
  }

  const { invalidateByKey } = useQueriesData();
  const { mutate, isPending } = useMutation({
    mutationKey: ['update-thumbnail'],
    mutationFn: async (file: File) =>
      toast.promise(updateThumbnail(axios, file), {
        loading: <Tran text="upload.uploading" />,
        error: (error) => ({ title: <Tran text="upload.fail" />, description: error?.message }),
        success: <Tran text="user.update-thumbnail-success" />,
      }),
    onSuccess: () => {
      invalidateByKey(['users']);
      setFile(undefined);
    },
  });

  return (
    <div className="flex gap-2 flex-col">
      <input id="image" className="w-16" hidden accept={acceptedImageFormats} type="file" onChange={handleFilePick} />
      <label className="flex cursor-pointer items-center justify-center overflow-hidden" htmlFor="image" hidden>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="object-scale-down" src={imageUrl} alt="preview" />
        )}
      </label>
      {file ? (
        <Button disabled={isPending} onClick={() => mutate(file)}>
          <Tran text="user.update-thumbnail" />
        </Button>
      ) : (
        <label className="flex h-fit w-fit cursor-pointer gap-1 justify-center items-center rounded-sm border px-2 py-1" htmlFor="image">
          <ImageIcon className="size-5" />
          <Tran text="user.upload-thumbnail" />
        </label>
      )}
    </div>
  );
}
