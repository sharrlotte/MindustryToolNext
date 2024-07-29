import { Metadata } from 'next';

import { getQuery } from '@/action/action';
import SchematicList from '@/app/[locale]/(user)/schematics/schematic-list';
import Prefetch from '@/components/common/prefetch';
import env from '@/constant/env';
import getServerAPI from '@/query/config/get-server-api';
import { ItemPaginationQuery } from '@/query/query';
import getSchematics from '@/query/schematic/get-schematics';
import { ServerComponentProps } from '@/types/data';

export async function generateMetadata(): Promise<Metadata> {
  const axios = await getServerAPI();
  const schematics = await getSchematics(axios, { page: 0, size: 1 });

  const schematic = schematics[0];

  return {
    title: schematic.name,
    openGraph: {
      title: schematic.name,
      images: `${env.url.image}schematic-previews/${schematic.id}.png`,
    },
  };
}

export default async function Page(props: ServerComponentProps) {
  const params = getQuery(props.searchParams, ItemPaginationQuery);

  return (
    <Prefetch
      queryFn={(axios) => getSchematics(axios, params)}
      queryKey={['schematic', params]}
    >
      <SchematicList />;
    </Prefetch>
  );
}
