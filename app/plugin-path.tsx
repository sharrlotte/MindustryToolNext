'use client';

import Tran from '@/components/common/tran';

import useClientApi from '@/hooks/use-client';
import { getPluginUploadCount } from '@/query/plugin';

import { useQuery } from '@tanstack/react-query';

export function PluginPath() {
  const axios = useClientApi();
  const { data } = useQuery({
    queryFn: () => getPluginUploadCount(axios, {}),
    queryKey: ['plugins', 'total', 'upload'],
    placeholderData: 0,
  });
  return (
    <>
      <Tran asChild text="plugin" />
      {data && data > 0 && <span> ({data})</span>}
    </>
  );
}
