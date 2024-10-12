import { Metadata } from 'next/dist/types';

import SchematicList from '@/app/[locale]/(user)/schematics/schematic-list';
import env from '@/constant/env';
import { getSchematics } from '@/query/schematic';
import axiosInstance from '@/query/config/config';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const schematics = await getSchematics(axiosInstance, { page: 0, size: 1 });

  const schematic = schematics[0];

  return {
    title: `${env.webName} > Schematic`,
    description: schematic.name,
    openGraph: {
      title: schematic.name,
      images: `${env.url.image}schematic-previews/${schematic.id}.png`,
    },
  };
}

export default async function Page() {
  return <SchematicList />;
}
