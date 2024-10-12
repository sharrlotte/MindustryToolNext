import { Metadata } from 'next/dist/types';

import MapList from '@/app/[locale]/(user)/maps/map-list';
import env from '@/constant/env';
import { getMaps } from '@/query/map';
import axiosInstance from '@/query/config/config';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const maps = await getMaps(axiosInstance, { page: 0, size: 1 });

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

export default async function MapPage() {
  return <MapList />;
}
