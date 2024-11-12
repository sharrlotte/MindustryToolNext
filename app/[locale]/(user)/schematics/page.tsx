import { Metadata } from 'next/dist/types';

import SchematicList from '@/app/[locale]/(user)/schematics/schematic-list';
import env from '@/constant/env';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${env.webName} > Schematic`,
  };
}

export default async function Page() {
  return <SchematicList />;
}
