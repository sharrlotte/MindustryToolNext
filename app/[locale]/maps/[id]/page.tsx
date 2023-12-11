import MapPage from '@/app/[locale]/maps/[id]/map-page';
import env from '@/constant/env';
import getMap from '@/query/map/get-map';
import { Metadata } from 'next';
import React from 'react';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const map = await getMap({ id });

  return {
    title: map.name,
    openGraph: {
      title: map.name,
      images: `${env.url.api}/maps/${map.id}/image`,
    },
  };
}

export default async function Page() {
  return <MapPage />;
}
