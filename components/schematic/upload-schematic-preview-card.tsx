import React, { HTMLAttributes } from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import Link from 'next/link';
import Preview from '@/components/preview/preview';
import { Schematic } from '@/types/response/Schematic';
import { cn } from '@/lib/utils';
import env from '@/constant/env';
import getSchematicData from '@/query/schematic/get-schematic-data';
import useClientAPI from '@/hooks/use-client';
import { useI18n } from '@/locales/client';
import useToastAction from '@/hooks/use-toast-action';

type UploadSchematicPreviewCardProps = HTMLAttributes<HTMLDivElement> & {
  schematic: Schematic;
};

export default function UploadSchematicPreviewCard({
  className,
  schematic,
  ...rest
}: UploadSchematicPreviewCardProps) {
  const { axios } = useClientAPI();
  const t = useI18n();

  const link = `${env.url.base}/admin/schematics/${schematic.id}`;

  const getData = useToastAction({
    title: t('copying'),
    content: t('downloading-data'),
    action: async () => await getSchematicData(axios, schematic.id),
  });

  return (
    <Preview
      className={cn('group relative flex flex-col', className)}
      {...rest}
    >
      <CopyButton
        className="absolute left-1 top-1 aspect-square transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
        variant="ghost"
        data={link}
        content={link}
      />
      <Link href={`/admin/schematics/${schematic.id}`}>
        <Preview.Image
          src={`${env.url.image}/schematics/${schematic.id}.png`}
          errorSrc={`${env.url.api}/schematics/${schematic.id}/image`}
          alt={schematic.name}
        />
      </Link>
      <Preview.Description>
        <Preview.Header className="h-12">{schematic.name}</Preview.Header>
        <Preview.Actions>
          <CopyButton
            className="border border-border "
            variant="outline"
            content={`Copied schematic ${schematic.name}`}
            data={getData}
          />
          <DownloadButton
            href={`${env.url.api}/schematics/${schematic.id}/download`}
            fileName={`{${schematic.name}}.msch`}
          />
        </Preview.Actions>
      </Preview.Description>
    </Preview>
  );
}
