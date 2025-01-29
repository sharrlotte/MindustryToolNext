'use client';

import Tran from '@/components/common/tran';

import useClientApi from '@/hooks/use-client';
import { getPostUploadCount } from '@/query/post';

import { useQuery } from '@tanstack/react-query';

export function PostPath() {
  const axios = useClientApi();
  const { data } = useQuery({
    queryFn: () => getPostUploadCount(axios, {}),
    queryKey: ['posts', 'total', 'upload'],
    placeholderData: 0,
  });
  return (
    <>
      <Tran asChild text="post" />
      {data && data > 0 && <span> ({data})</span>}
    </>
  );
}
