import { Metadata } from 'next';
import React from 'react';

import SchematicDetailCard from '@/components/schematic/schematic-detail-card';
import env from '@/constant/env';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { getSchematic } from '@/query/schematic';
import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const schematic = await serverApi((axios) => getSchematic(axios, { id }));

  if ('error' in schematic) {
    throw schematic;
  }

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
  const schematic = await serverApi((axios) => getSchematic(axios, params));

  if ('error' in schematic) {
    return <ErrorScreen error={schematic} />;
  }

  return <SchematicDetailCard schematic={schematic} />;
}
