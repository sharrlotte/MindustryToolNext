'use client';

import { useRouter } from 'next/navigation';

import DeleteButton, { DeleteButtonProps } from '@/components/button/delete-button';
import Tran from '@/components/common/tran';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { deleteSchematic } from '@/query/schematic';

import { useMutation } from '@tanstack/react-query';

type DeleteSchematicButtonProps = {
  id: string;
  name: string;
  variant?: DeleteButtonProps['variant'];
};

export function DeleteSchematicButton({ id, name, variant }: DeleteSchematicButtonProps) {
  const axios = useClientApi();
  const { back } = useRouter();
  const { invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    scope: {
      id,
    },
    mutationFn: (id: string) => deleteSchematic(axios, id),
    onSuccess: () => {
      back();
      toast({
        title: <Tran text="delete-success" />,
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: <Tran text="delete-fail" />,
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['schematics']);
    },
  });

  return <DeleteButton variant={variant} description={<Tran text="delete-alert" args={{ name }} />} isLoading={isPending} onClick={() => mutate(id)} />;
}
