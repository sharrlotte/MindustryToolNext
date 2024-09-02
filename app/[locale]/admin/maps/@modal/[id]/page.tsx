import React from 'react';

import UploadMapDetailCard from '@/components/map/upload-map-detail-card';
import getServerApi from '@/query/config/get-server-api';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { getMapUpload } from '@/query/map';
import { Metadata } from 'next';
import env from '@/constant/env';
import Tran from '@/components/common/tran';
import BackButton from '@/components/ui/back-button';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const axios = await getServerApi();
  const map = await getMapUpload(axios, { id });

  return {
    title: map.name,
    description: map.description,
    openGraph: {
      title: map.name,
      description: map.description,
      images: `${env.url.image}map-previews/${map.id}.png`,
    },
  };
}

export default async function Page({ params }: { params: IdSearchParams }) {
  const axios = await getServerApi();
  const map = await getMapUpload(axios, params);

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
