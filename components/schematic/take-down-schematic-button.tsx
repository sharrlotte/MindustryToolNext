'use client';

import { useRouter } from 'next/navigation';

import TakeDownButton from '@/components/button/take-down-button';
import Tran from '@/components/common/tran';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { unverifySchematic } from '@/query/schematic';

import { useMutation } from '@tanstack/react-query';

type TakeDownSchematicButtonProps = {
  id: string;
  name: string;
};

export function TakeDownSchematicButton({ id, name }: TakeDownSchematicButtonProps) {
  const axios = useClientApi();
  const { back } = useRouter();
  const { invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    scope: {
      id,
    },
    mutationFn: (id: string) => unverifySchematic(axios, id),
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
      invalidateByKey(['schematics']);
    },
  });

  return <TakeDownButton isLoading={isPending} description={<Tran text="take-down-alert" args={{ name }} />} onClick={() => mutate(id)} />;
}
