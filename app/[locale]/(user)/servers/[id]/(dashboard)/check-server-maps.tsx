'use client';

import { useEffect } from 'react';

import Tran from '@/components/common/tran';

import useClientApi from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import { getInternalServerMaps } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

type Props = {
  id: string;
};

export default function CheckServerMaps({ id }: Props) {
  const axios = useClientApi();
  const { toast } = useToast();

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
        return toast({
          title: <Tran text="error" />,
          description: error.message,
          variant: 'destructive',
        });
      }

      if (data?.length === 0) {
        toast({
          description: <Tran text="server.no-map-warning" />,
          variant: 'warning',
        });
      }
    }

    checkForMap();
  }, [data, isLoading, error, toast]);

  return undefined;
}
