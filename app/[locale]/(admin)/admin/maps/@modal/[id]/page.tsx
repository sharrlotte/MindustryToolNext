import React from 'react';

import UploadMapDetailCard from '@/components/map/upload-map-detail-card';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { getMapUpload } from '@/query/map';
import { Metadata } from 'next';
import env from '@/constant/env';
import Tran from '@/components/common/tran';
import BackButton from '@/components/ui/back-button';
import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const map = await serverApi((axios) => getMapUpload(axios, { id }));

  if ('error' in map) {
    throw map;
  }

  return {
    title: `${env.webName} > Map`,
    description: `${map.name} | ${map.description}`,
    openGraph: {
      title: map.name,
      description: map.description,
      images: `${env.url.image}map-previews/${map.id}.png`,
    },
  };
}

export default async function Page({ params }: { params: IdSearchParams }) {
  const map = await serverApi((axios) => getMapUpload(axios, params));

  if ('error' in map) {
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
