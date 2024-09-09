'use client';

import { ImageIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { getUser, updateThumbnail } from '@/query/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';

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

  const imageUrl = useMemo(
    () =>
      file
        ? URL.createObjectURL(file)
        : data?.thumbnail
          ? `${data.thumbnail}.png`
          : undefined,
    [file, data?.thumbnail],
  );

  function handleFilePick(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files;

    if (!files || files.length === 0) {
      return;
    }

    setFile(files[0]);
  }

  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const { mutate, isPending } = useMutation({
    mutationKey: ['update-thumbnail'],
    mutationFn: (file: File) => updateThumbnail(axios, file),
    onSuccess: () => {
      invalidateByKey(['users']);
      setFile(undefined);
      toast({
        title: 'Thumbnail updated successfully',
        description: 'Your profile picture has been updated.',
        variant: 'success',
      });
    },
  });

  return (
    <div className="flex gap-2">
      <input
        id="image"
        className="w-16"
        hidden
        accept=".png, .jpg, .jpeg"
        type="file"
        onChange={handleFilePick}
      />
      <label
        className="flex cursor-pointer items-center justify-center overflow-hidden"
        htmlFor="image"
        hidden
      >
        {imageUrl && (
          <img className="object-scale-down" src={imageUrl} alt="preview" />
        )}
      </label>
      {file ? (
        <Button disabled={isPending} onClick={() => mutate(file)}>
          <Tran text="user.update-thumbnail" />
        </Button>
      ) : (
        <label
          className="flex h-fit w-fit cursor-pointer gap-1 rounded-sm border px-2 py-1"
          htmlFor="image"
        >
          <ImageIcon className="size-5" />
          <Tran text="user.upload-thumbnail" />
        </label>
      )}
    </div>
  );
}
