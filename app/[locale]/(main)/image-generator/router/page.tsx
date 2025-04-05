'use client';

import axios from 'axios';
import saveAs from 'file-saver';
import { useState } from 'react';

import CopyButton from '@/components/button/copy-button';
import { CopyIcon, DownloadIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/router-spinner';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

import { IMAGE_PREFIX } from '@/constant/constant';
import useClientApi from '@/hooks/use-client';
import { getSchematicPreview } from '@/query/schematic';

import { useMutation, useQuery } from '@tanstack/react-query';

/* eslint-disable @next/next/no-img-element */

export default function Page() {
  const [image, setImage] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          width: img.width,
          height: img.height,
        });
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    }
    setImage(file);
  };

  const [blockSize, setBlockSize] = useState([8]);
  const [splitHorizontal, setSplitHorizontal] = useState(1);
  const [splitVertical, setSplitVertical] = useState(1);

  const resultDimensions = {
    width: Math.ceil(imageDimensions.width / blockSize[0] / splitHorizontal),
    height: Math.ceil(imageDimensions.height / blockSize[0] / splitVertical),
  };

  const { data, isPending, mutate } = useMutation({
    mutationKey: ['image-generator', image],
    mutationFn: async () => {
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('blockSize', blockSize[0].toString());
        formData.append('splitHorizontal', splitHorizontal.toString());
        formData.append('splitVertical', splitVertical.toString());

        return await axios.post('/api/v1/image-generator', formData, { data: formData }).then((result) => result.data as string[]);
      }
      return null;
    },
  });

  return (
    <div className="space-y-4 container mx-auto">
      <h1>
        <Tran text="image-generator.title" />
      </h1>
      <input className="bg-background" type="file" accept="image/*" onChange={handleImageChange} />
      {image && (
        <div className="text-sm text-muted-foreground">
          <div>
            <Tran text="image-generator.original-size" /> {imageDimensions.width} x {imageDimensions.height}px
          </div>
          <div>
            <Tran text="image-generator.result-size" /> {resultDimensions.width} x {resultDimensions.height} blocks
          </div>
          <div>
            <Tran text="image-generator.total-blocks" /> {splitHorizontal * splitVertical} blocks
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Tran text="image-generator.ratio" /> : 1 / {blockSize[0]}
        <Slider value={blockSize} onValueChange={setBlockSize} min={1} max={20} step={1} />
      </div>
      <div className="flex gap-4 md:flex-row flex-col w-full">
        <div className="space-y-2 w-full">
          <Tran text="image-generator.split-vertical" /> : {splitVertical}
          <Slider value={[splitVertical]} onValueChange={(value) => setSplitVertical(value[0])} min={1} max={4} step={1} />
        </div>
        <div className="space-y-2 w-full">
          <Tran text="image-generator.split-horizontal" /> : {splitHorizontal}
          <Slider value={[splitHorizontal]} onValueChange={(value) => setSplitHorizontal(value[0])} min={1} max={4} step={1} />
        </div>
      </div>
      {isPending ? (
        <div className="flex w-full items-center justify-center gap-1">
          <LoadingSpinner className="m-0" />
          <span>Generating schematic</span>
        </div>
      ) : (
        <section className="flex flex-col gap-2">
          {data?.map((item, index) => (
            <div key={index} className="border rounded-lg p-2 relative space-y-2">
              <span className="font-bold align-text-top">{index}</span>
              <Preview data={item} />
              <div className="flex items-center gap-1">
                <CopyButton className="gap-1 flex" data={item}>
                  <CopyIcon className="size-5" />
                  <Tran text="copy" />
                </CopyButton>
                <DownloadButton data={item} />
              </div>
            </div>
          ))}
        </section>
      )}
      {image && (
        <Button variant="primary" onClick={() => mutate()} disabled={isPending}>
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
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center gap-1">
        <LoadingSpinner className="m-0" />
        <span>Generating preview</span>
      </div>
    );
  }
  return <div>{preview && <img className="max-w-[50vw] max-h-[50vh]" src={IMAGE_PREFIX + preview.image} alt="Processed" />}</div>;
}

function DownloadButton({ data }: { data: string }) {
  function download() {
    const blob = new Blob([Buffer.from(data, 'base64').toString('binary')], { type: 'text/plain;charset=utf-8;' });
    saveAs(blob, 'image.msch');
  }

  return (
    <Button onClick={download}>
      <DownloadIcon className="size-5" />
      <Tran text="download" />
    </Button>
  );
}
