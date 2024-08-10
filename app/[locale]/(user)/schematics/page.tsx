import { Metadata } from 'next';

import SchematicList from '@/app/[locale]/(user)/schematics/schematic-list';
import env from '@/constant/env';
import getServerAPI from '@/query/config/get-server-api';
import { getSchematics } from '@/query/schematic';

export async function generateMetadata(): Promise<Metadata> {
  const axios = await getServerAPI();
  const schematics = await getSchematics(axios, { page: 0, size: 1 });

  const schematic = schematics[0];

  return {
    title: 'Mindustry schematics',
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
