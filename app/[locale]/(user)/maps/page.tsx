import { Metadata } from 'next/dist/types';

import MapList from '@/app/[locale]/(user)/maps/map-list';
import env from '@/constant/env';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${env.webName} > Map`,
  };
}

export default async function MapPage() {
  return <MapList />;
}
