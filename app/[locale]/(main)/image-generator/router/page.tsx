'use client';

import { useState } from 'react';

import CopyButton from '@/components/button/copy-button';
import LoadingSpinner from '@/components/common/router-spinner';
import { Slider } from '@/components/ui/slider';

import { IMAGE_PREFIX } from '@/constant/constant';
import useClientApi from '@/hooks/use-client';
import { getSchematicPreview } from '@/query/schematic';

import { useQuery } from '@tanstack/react-query';

/* eslint-disable @next/next/no-img-element */

export default function Page() {
  const [image, setImage] = useState<File | null>(null);
  const [blockSize, setBlockSize] = useState([8]);
  const axios = useClientApi();

  const { data, isPending } = useQuery({
    queryKey: ['image-generator', image],
    queryFn: async () => {
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('blockSize', blockSize[0].toString());

        const res = await fetch('/api/v1/image-generator', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          return (await res.json()) as string;
        }
      }
      return null;
    },
    enabled: !!image,
  });

  const { data: preview, isPending: isGeneratingPreview } = useQuery({
    queryKey: ['image-preview', data],
    queryFn: () => (data ? getSchematicPreview(axios, { data }) : null),
    enabled: !!data,
  });

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <div>
        Block size: {blockSize} <Slider value={blockSize} onValueChange={setBlockSize} min={2} max={20} step={1} />
      </div>
      {isPending || isGeneratingPreview ? (
        <LoadingSpinner />
      ) : (
        !!data &&
        !!preview && (
          <div>
            Preview
            <img className="w-[50vw]" src={IMAGE_PREFIX + preview} alt="Processed" />
            <CopyButton data={data} />
          </div>
        )
      )}
    </div>
  );
}
