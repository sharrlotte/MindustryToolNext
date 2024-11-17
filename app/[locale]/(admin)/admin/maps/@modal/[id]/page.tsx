import { Metadata } from 'next';
import React from 'react';

import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';
import UploadMapDetailCard from '@/components/map/upload-map-detail-card';
import BackButton from '@/components/ui/back-button';
import env from '@/constant/env';
import { isError } from '@/lib/utils';
import { getMapUpload } from '@/query/map';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const map = await serverApi((axios) => getMapUpload(axios, { id }));

  if (isError(map)) {
    return { title: 'Error' };
  }

  return {
    title: `${env.webName} > Map`,
    description: `${map.name} | ${map.description}`,
    openGraph: {
      title: map.name,
      description: map.description,
      images: `${env.url.image}map-previews/${map.id}${env.imageFormat}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const map = await serverApi((axios) => getMapUpload(axios, { id }));

  if (isError(map)) {
    return <ErrorScreen error={map} />;
  }

  if (map.isVerified === true) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background">
        <Tran text="admin.item-has-been-verified" />
        <BackButton />
      </div>
    );
  }

  return <UploadMapDetailCard map={map} />;
}
