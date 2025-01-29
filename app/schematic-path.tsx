'use client';

import Tran from '@/components/common/tran';

import useClientApi from '@/hooks/use-client';
import { getSchematicUploadCount } from '@/query/schematic';

import { useQuery } from '@tanstack/react-query';

export function SchematicPath() {
  const axios = useClientApi();
  const { data } = useQuery({
    queryFn: () => getSchematicUploadCount(axios, {}),
    queryKey: ['schematics', 'total', 'upload'],
    placeholderData: 0,
  });
  return (
    <>
      <Tran asChild text="schematic" />
      {(data ?? 0) > 0 && <span> ({data})</span>}
    </>
  );
}
