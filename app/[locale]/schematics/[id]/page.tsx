import SchematicPage from '@/app/[locale]/schematics/[id]/schematic-page';
import env from '@/constant/env';
import getSchematic from '@/query/schematic/get-schematic';
import { Metadata } from 'next';
import React from 'react';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const map = await getSchematic({ id });

  return {
    title: map.name,
    openGraph: {
      title: map.name,
      images: `${env.url.api}/schematics/${map.id}/image`,
    },
  };
}

export default async function Page() {
  return <SchematicPage />;
}
