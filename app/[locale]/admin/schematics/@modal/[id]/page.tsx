import UploadSchematicDetail from '@/components/schematic/upload-schematic-detail';
import getServerAPI from '@/query/config/get-server-api';
import getSchematic from '@/query/schematic/get-schematic';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function Page({ params }: { params: IdSearchParams }) {
  const { axios } = await getServerAPI();
  const schematic = await getSchematic(axios, params);

  if (!schematic) {
    return notFound();
  }

  return <UploadSchematicDetail schematic={schematic} />;
}
