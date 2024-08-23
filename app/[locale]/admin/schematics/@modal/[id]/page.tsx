import React from 'react';

import UploadSchematicDetailCard from '@/components/schematic/upload-schematic-detail-card';
import getServerAPI from '@/query/config/get-server-api';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { getSchematicUpload } from '@/query/schematic';
import { Metadata } from 'next';
import env from '@/constant/env';
type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const axios = await getServerAPI();
  const schematic = await getSchematicUpload(axios, { id });

  return {
    title: schematic.name,
    description: schematic.description,
    openGraph: {
      title: schematic.name,
      description: schematic.description,
      images: `${env.url.image}schematic-previews/${schematic.id}.png`,
    },
  };
}

export default async function Page({ params }: { params: IdSearchParams }) {
  const axios = await getServerAPI();
  const schematic = await getSchematicUpload(axios, params);
  return <UploadSchematicDetailCard schematic={schematic} />;
}
