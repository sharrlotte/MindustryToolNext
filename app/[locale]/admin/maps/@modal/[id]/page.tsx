import UploadMapDetailCard from '@/components/map/upload-map-detail-card';
import getServerAPI from '@/query/config/get-server-api';
import getMap from '@/query/map/get-map';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function Page({ params }: { params: IdSearchParams }) {
  const { axios } = await getServerAPI();
  const map = await getMap(axios, params);

  if (!map) {
    return notFound();
  }

  return <UploadMapDetailCard map={map} />;
}
