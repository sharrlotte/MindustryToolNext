import { Metadata } from 'next/dist/types';
import React from 'react';

import { serverApi, translate } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import SchematicDetailCard from '@/components/schematic/schematic-detail-card';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { formatTitle, isError } from '@/lib/utils';
import { getSchematic } from '@/query/schematic';

type Props = {
  params: Promise<{ id: string; locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const schematic = await serverApi((axios) => getSchematic(axios, { id }));
  const title = await translate(locale, 'schematic');

  if (isError(schematic)) {
    return { title: 'Error' };
  }

  const { name, description } = schematic;

  return {
    title: formatTitle(title),
    description: [name, description].join('|'),
    openGraph: {
      title: name,
      description: description,
      images: `${env.url.image}/schematics/${id}${env.imageFormat}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const schematic = await serverApi((axios) => getSchematic(axios, { id }));

  if (isError(schematic)) {
    return <ErrorScreen error={schematic} />;
  }

  return <SchematicDetailCard schematic={schematic} />;
}
