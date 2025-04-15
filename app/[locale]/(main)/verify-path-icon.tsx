'use client';

import { IconNotification } from '@/components/common/icon-notification';
import { VerifyIcon } from '@/components/common/icons';

import useClientApi from '@/hooks/use-client';
import { getMapUploadCount } from '@/query/map';
import { getPluginUploadCount } from '@/query/plugin';
import { getPostUploadCount } from '@/query/post';
import { getSchematicUploadCount } from '@/query/schematic';

import { useQueries } from '@tanstack/react-query';

export function VerifyPathIcon() {
  const axios = useClientApi();

  const [{ data: schematicCount }, { data: mapCount }, { data: postCount }, { data: pluginCount }] = useQueries({
    queries: [
      {
        queryFn: () => getSchematicUploadCount(axios, {}),
        queryKey: ['schematics', 'total', 'upload'],
        placeholderData: 0,
      },
      {
        queryFn: () => getMapUploadCount(axios, {}),
        queryKey: ['maps', 'total', 'upload'],
        placeholderData: 0,
      },
      {
        queryFn: () => getPostUploadCount(axios, {}),
        queryKey: ['posts', 'total', 'upload'],
        placeholderData: 0,
      },
      {
        queryFn: () => getPluginUploadCount(axios, {}),
        queryKey: ['plugins', 'total', 'upload'],
        placeholderData: 0,
      },
    ],
  });

  const total = (schematicCount || 0) + (mapCount || 0) + (postCount || 0) + (pluginCount || 0);

  return (
    <IconNotification number={total}>
      <VerifyIcon />
    </IconNotification>
  );
}
