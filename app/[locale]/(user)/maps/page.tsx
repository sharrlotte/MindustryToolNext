import { Metadata } from 'next/dist/types';

import MapList from '@/app/[locale]/(user)/maps/map-list';
import env from '@/constant/env';
import { getMaps } from '@/query/map';
import { serverApi } from '@/action/action';

export async function generateMetadata(): Promise<Metadata> {
  const maps = await serverApi((axios) => getMaps(axios, { page: 0, size: 1 }));

  if ('error' in maps) {
    throw maps;
  }

  const map = maps[0];

  return {
    title: `${env.webName} > Map`,
    description: `${map.name}`,
    openGraph: {
      title: map.name,
      images: `${env.url.image}map-previews/${map.id}.png`,
    },
  };
}

export default function MapPage() {
  return <MapList />;
}
