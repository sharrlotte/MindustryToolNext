'use client';

import Tran from '@/components/common/tran';
import useClientApi from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import { getInternalServerMaps } from '@/query/server';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

type Props = {
  id: string;
};

export default function CheckServerMaps({ id }: Props) {
  const axios = useClientApi();
  const { toast } = useToast();

  const { isLoading, data } = useQuery({
    queryFn: () => getInternalServerMaps(axios, id, { size: 2, page: 0 }),
    queryKey: [],
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (data?.length === 0) {
      toast({
        description: <Tran text="server.no-map-warning" />,
        variant: 'warning',
      });
    }
  }, [data, isLoading, toast]);

  return undefined;
}
