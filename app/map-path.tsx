'use client';

import Tran from '@/components/common/tran';

import useClientApi from '@/hooks/use-client';
import { getMapUploadCount } from '@/query/map';

import { useQuery } from '@tanstack/react-query';

export function MapPath() {
  const axios = useClientApi();
  const { data } = useQuery({
    queryFn: () => getMapUploadCount(axios, {}),
    queryKey: ['maps', 'total', 'upload'],
    placeholderData: 0,
  });
  return (
    <>
      <Tran asChild text="map" />
      {data && data > 0 && <span> ({data})</span>}
    </>
  );
}
