import { Metadata } from 'next/dist/types';
import React, { cache } from 'react';

import ErrorScreen from '@/components/common/error-screen';
import SchematicDetailCard from '@/components/schematic/schematic-detail-card';

import { getServerApi, serverApi } from '@/action/action';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { formatTitle, isError } from '@/lib/utils';
import { getSchematic, getSchematicCount, getSchematics } from '@/query/schematic';

type Props = {
  params: Promise<{ id: string; locale: Locale }>;
};

const getCachedSchematic = cache((id: string) => serverApi((axios) => getSchematic(axios, { id })));
export const experimental_ppr = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const schematic = await getCachedSchematic(id);

  if (isError(schematic)) {
    return { title: 'Error' };
  }

  const { name, description } = schematic;

  return {
    title: formatTitle(name),
    description: [name, description].join('|'),
    openGraph: {
      title: name,
      description: description,
      images: `${env.url.image}/schematics/${id}${env.imageFormat}`,
    },
  };
}

export async function generateStaticParams() {
  const axios = await getServerApi();
  const schematicCount = await getSchematicCount(axios, {});
  const page = schematicCount / 100;
  const schematics = await Promise.all(Array.from({ length: Math.ceil(page) }, (_, i) => getSchematics(axios, { page: i, size: 100 })));

  return schematics.reduce((acc, cur) => [...acc, ...cur], []).map(({ id }) => ({ params: { id } }));
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const schematic = await getCachedSchematic(id);

  if (isError(schematic)) {
    return <ErrorScreen error={schematic} />;
  }

  return <SchematicDetailCard schematic={schematic} />;
}
