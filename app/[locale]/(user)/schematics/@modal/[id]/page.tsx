import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import SchematicDetailCard from '@/components/schematic/schematic-detail-card';
import env from '@/constant/env';
import getServerApi from '@/query/config/get-server-api';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { getSchematic } from '@/query/schematic';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const axios = await getServerApi();
  const schematic = await getSchematic(axios, { id });

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
  const axios = await getServerApi();
  const schematic = await getSchematic(axios, params);

  if (!schematic) {
    return notFound();
  }

  return <SchematicDetailCard schematic={schematic} />;
}
