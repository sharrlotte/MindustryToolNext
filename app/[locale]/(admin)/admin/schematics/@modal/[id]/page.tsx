import { Metadata } from 'next/dist/types';
import React from 'react';

import { serverApi, translate } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';
import UploadSchematicDetailCard from '@/components/schematic/upload-schematic-detail-card';
import BackButton from '@/components/ui/back-button';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { formatTitle, isError } from '@/lib/utils';
import { getSchematicUpload } from '@/query/schematic';

type Props = {
  params: Promise<{ id: string; locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const schematic = await serverApi((axios) => getSchematicUpload(axios, { id }));
  const title = await translate(locale, 'schematic');

  if (isError(schematic)) {
    return { title: 'Error' };
  }

  const { name, description } = schematic;

  return {
    title: formatTitle(title),
    description: [name, description].join('|'),
    openGraph: {
      title: name,
      description: description,
      images: `${env.url.image}/schematic-previews/${id}${env.imageFormat}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const schematic = await serverApi((axios) => getSchematicUpload(axios, { id }));

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
