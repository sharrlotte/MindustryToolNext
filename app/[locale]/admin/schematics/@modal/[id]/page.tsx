import React from 'react';

import UploadSchematicDetailCard from '@/components/schematic/upload-schematic-detail-card';
import getServerAPI from '@/query/config/get-server-api';
import getSchematicUpload from '@/query/schematic/get-schematic-upload';
import { IdSearchParams } from '@/types/data/id-search-schema';

export default async function Page({ params }: { params: IdSearchParams }) {
  const axios = await getServerAPI();
  const schematic = await getSchematicUpload(axios, params);

  return <UploadSchematicDetailCard schematic={schematic} />;
}
