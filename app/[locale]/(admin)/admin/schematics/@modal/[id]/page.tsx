import React from 'react';

import UploadSchematicDetailCard from '@/components/schematic/upload-schematic-detail-card';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { getSchematicUpload } from '@/query/schematic';
import { Metadata } from 'next';
import env from '@/constant/env';
import Tran from '@/components/common/tran';
import BackButton from '@/components/ui/back-button';
import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const schematic = await serverApi((axios) =>
    getSchematicUpload(axios, { id }),
  );

  if ('error' in schematic) {
    return {};
  }

  return {
    title: schematic.name,
    description: schematic.description,
    openGraph: {
      title: schematic.name,
      description: schematic.description,
      images: `${env.url.image}schematic-previews/${schematic.id}.png`,
    },
  };
}

export default async function Page({ params }: { params: IdSearchParams }) {
  const schematic = await serverApi((axios) =>
    getSchematicUpload(axios, params),
  );

  if ('error' in schematic) {
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
