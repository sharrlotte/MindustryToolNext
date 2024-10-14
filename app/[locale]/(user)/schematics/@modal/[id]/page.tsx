import { Metadata } from 'next/dist/types';
import React from 'react';

import SchematicDetailCard from '@/components/schematic/schematic-detail-card';
import env from '@/constant/env';
import { getSchematic } from '@/query/schematic';
import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const schematic = await serverApi((axios) => getSchematic(axios, { id }));

  if ('error' in schematic) {
    throw schematic;
  }

  return {
    title: `${env.webName} > Schematic`,
    description: `${schematic.name} | ${schematic.description}`,
    openGraph: {
      title: schematic.name,
      description: schematic.description,
      images: `${env.url.image}schematic-previews/${schematic.id}${env.imageFormat}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const schematic = await serverApi((axios) => getSchematic(axios, { id }));

  if ('error' in schematic) {
    return <ErrorScreen error={schematic} />;
  }

  return <SchematicDetailCard schematic={schematic} />;
}
