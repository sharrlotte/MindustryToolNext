import { Metadata } from 'next/dist/types';
import React, { cache } from 'react';

import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';
import UploadSchematicDetailCard from '@/components/schematic/upload-schematic-detail-card';
import BackButton from '@/components/ui/back-button';

import { serverApi } from '@/action/action';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { formatTitle, isError } from '@/lib/utils';
import { getSchematicUpload } from '@/query/schematic';

type Props = {
  params: Promise<{ id: string; locale: Locale }>;
};

const getCachedSchematicUpload = cache((id: string) => serverApi((axios) => getSchematicUpload(axios, { id })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const schematic = await getCachedSchematicUpload(id);

  if (isError(schematic)) {
    return { title: 'Error' };
  }

  const { name, description } = schematic;

  return {
    title: formatTitle(name),
    description: [name, description].join('|'),
    openGraph: {
      title: name,
      description: description,
      images: `${env.url.image}/schematics/${id}${env.imageFormat}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const schematic = await getCachedSchematicUpload(id);

  if (isError(schematic)) {
    return <ErrorScreen error={schematic} />;
  }

  if (schematic.isVerified === true) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background">
        <Tran text="admin.item-has-been-verified" />
        <BackButton />
      </div>
    );
  }

  return <UploadSchematicDetailCard schematic={schematic} />;
}
