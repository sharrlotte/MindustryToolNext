'use client';

import { useEffect } from 'react';

import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import { getInternalServerMaps } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

type Props = {
  id: string;
};

export default function CheckServerMaps({ id }: Props) {
  const axios = useClientApi();

  const { isLoading, data, error } = useQuery({
    queryFn: () => getInternalServerMaps(axios, id, { size: 1, page: 0 }),
    queryKey: ['server', id, 'maps-check'],
  });

  useEffect(() => {
    function checkForMap() {
      if (isLoading) {
        return;
      }

      if (error) {
        return toast(<Tran text="error" />, { description: error.message });
      }

      if (data?.length === 0) {
        toast.warning(<Tran text="server.no-map-warning" />);
      }
    }

    checkForMap();
  }, [data, isLoading, error]);

  return undefined;
}
