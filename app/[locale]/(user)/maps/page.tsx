import { Metadata } from 'next';

import MapList from '@/app/[locale]/(user)/maps/map-list';
import env from '@/constant/env';
import getServerAPI from '@/query/config/get-server-api';
import getMaps from '@/query/map/get-maps';

export async function generateMetadata(): Promise<Metadata> {
  const axios = await getServerAPI();
  const maps = await getMaps(axios, { page: 0, size: 1 });

  const map = maps[0];

  return {
    title: 'Mindustry maps',
    description: map.name,
    openGraph: {
      title: map.name,
      images: `${env.url.image}map-previews/${map.id}.png`,
    },
  };
}

export default function MapPage() {
  return <MapList />;
}
