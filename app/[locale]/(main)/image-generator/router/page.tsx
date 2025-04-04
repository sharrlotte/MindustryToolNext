'use client';

import { useState } from 'react';

import CopyButton from '@/components/button/copy-button';
import LoadingSpinner from '@/components/common/router-spinner';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

import { IMAGE_PREFIX } from '@/constant/constant';
import useClientApi from '@/hooks/use-client';
import { getSchematicPreview } from '@/query/schematic';

import { useMutation, useQuery } from '@tanstack/react-query';

/* eslint-disable @next/next/no-img-element */

export default function Page() {
  const [image, setImage] = useState<File | null>(null);
  const [blockSize, setBlockSize] = useState([8]);

  const { data, isPending, mutate } = useMutation({
    mutationKey: ['image-generator', image],
    mutationFn: async () => {
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('blockSize', blockSize[0].toString());

        const res = await fetch('/api/v1/image-generator', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          return await res.text();
        }
      }
      return null;
    },
  });

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <div>
        Block size: {blockSize} <Slider value={blockSize} onValueChange={setBlockSize} min={2} max={20} step={1} />
      </div>
      {isPending ? (
        <div className="flex w-full items-center justify-center">
          <LoadingSpinner className="m-0" />
          <span>Generating schematic</span>
        </div>
      ) : (
        data && (
          <>
            <Preview data={data} />
            <CopyButton data={data} />
          </>
        )
      )}
      {image && (
        <Button onClick={() => mutate()} disabled={isPending}>
          Process
        </Button>
      )}
    </div>
  );
}

function Preview({ data }: { data: string }) {
  const axios = useClientApi();

  const { data: preview, isLoading } = useQuery({
    queryKey: ['image-preview', data],
    queryFn: () => (data ? getSchematicPreview(axios, { data }) : null),
  });

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <LoadingSpinner className="m-0" />
        <span>Generating preview</span>
      </div>
    );
  }
  return <div>{preview && <img className="w-[50vw]" src={IMAGE_PREFIX + preview.image} alt="Processed" />}</div>;
}
