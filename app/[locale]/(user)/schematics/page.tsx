import { Metadata } from 'next';

import SchematicList from '@/app/[locale]/(user)/schematics/schematic-list';
import env from '@/constant/env';
import { getSchematics } from '@/query/schematic';
import { serverApi } from '@/action/action';

export async function generateMetadata(): Promise<Metadata> {
  const schematics = await serverApi((axios) =>
    getSchematics(axios, { page: 0, size: 1 }),
  );

  if ('error' in schematics) {
    throw schematics;
  }

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
