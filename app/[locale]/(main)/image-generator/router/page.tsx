/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';

import LoadingSpinner from '@/components/common/router-spinner';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

import { useMutation } from '@tanstack/react-query';

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

export default function Page() {
  const [image, setImage] = useState<File | null>(null);
  const [blockSize, setBlockSize] = useState([8]);

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('blockSize', blockSize[0].toString());

    const res = await fetch('/api/v1/image-generator', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    }
  };

  const { data, isPending, mutate } = useMutation({ mutationFn: () => handleUpload() });

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <Button onClick={() => mutate()}>Process Image</Button>
      <div>
        Block size: {blockSize} <Slider value={blockSize} onValueChange={setBlockSize} min={2} max={20} step={1} />
      </div>
      {isPending ? (
        <LoadingSpinner />
      ) : (
        data && (
          <div>
            Preview
            <img className="w-[50vw]" src={data} alt="Processed" />
          </div>
        )
      )}
    </div>
  );
}
