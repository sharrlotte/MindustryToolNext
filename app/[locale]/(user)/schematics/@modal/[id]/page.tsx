import SchematicDetailCard from '@/components/schematic/schematic-detail-card';
import env from '@/constant/env';
import getServerAPI from '@/query/config/get-server-api';
import getSchematic from '@/query/schematic/get-schematic';
import { IdSearchParams } from '@/types/data/id-search-schema';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const { axios } = await getServerAPI();
  const schematic = await getSchematic(axios, { id });

  return {
    title: schematic.name,
    description: schematic.description,
    openGraph: {
      title: schematic.name,
      description: schematic.description,
      images: `${env.url.api}/schematics/${schematic.id}/image`,
    },
  };
}

export default async function Page({ params }: { params: IdSearchParams }) {
  const { axios } = await getServerAPI();
  const schematic = await getSchematic(axios, params);

  if (!schematic) {
    return notFound();
  }

  return <SchematicDetailCard schematic={schematic} />;
}
