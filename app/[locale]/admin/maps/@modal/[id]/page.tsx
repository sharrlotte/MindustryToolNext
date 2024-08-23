import React from 'react';

import UploadMapDetailCard from '@/components/map/upload-map-detail-card';
import getServerAPI from '@/query/config/get-server-api';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { getMapUpload } from '@/query/map';
import { Metadata } from 'next';
import env from '@/constant/env';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const axios = await getServerAPI();
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
  const axios = await getServerAPI();
  const map = await getMapUpload(axios, params);

  return <UploadMapDetailCard map={map} />;
}
