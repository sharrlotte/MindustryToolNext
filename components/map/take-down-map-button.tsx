'use client';

import TakeDownButton from '@/components/button/take-down-button';
import Tran from '@/components/common/tran';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { unverifyMap } from '@/query/map';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type TakeDownMapButtonProps = {
  id: string;
  name: string;
};

export function TakeDownMapButton({ id, name }: TakeDownMapButtonProps) {
  const axios = useClientApi();
  const { back } = useRouter();
  const { invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    scope: {
      id,
    },
    mutationFn: (id: string) => unverifyMap(axios, id),
    onSuccess: () => {
      back();
      toast({
        title: <Tran text="take-down-success" />,
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: <Tran text="take-down-fail" />,
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['maps']);
    },
  });

  return <TakeDownButton isLoading={isPending} description={<Tran text="take-down-alert" args={{ name: name }} />} onClick={() => mutate(id)} />;
}
