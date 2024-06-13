import React from 'react';

import UploadMapDetailCard from '@/components/map/upload-map-detail-card';
import getServerAPI from '@/query/config/get-server-api';
import getMapUpload from '@/query/map/get-map-upload';
import { IdSearchParams } from '@/types/data/id-search-schema';

export default async function Page({ params }: { params: IdSearchParams }) {
  const axios = await getServerAPI();
  const map = await getMapUpload(axios, params);

  return <UploadMapDetailCard map={map} />;
}
