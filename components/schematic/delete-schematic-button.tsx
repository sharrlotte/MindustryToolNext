'use client';

import DeleteButton from '@/components/button/delete-button';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import deleteSchematic from '@/query/schematic/delete-schematic';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type DeleteSchematicButtonProps = {
  id: string;
  name: string;
};

export function DeleteSchematicButton({
  id,
  name,
}: DeleteSchematicButtonProps) {
  const axios = useClientAPI();
  const t = useI18n();
  const { back } = useRouter();
  const { deleteById, invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    scope: {
      id,
    },
    mutationFn: (id: string) => deleteSchematic(axios, id),
    onSuccess: () => {
      deleteById(['schematic'], id);
      invalidateByKey(['schematic', 'total']);
      back();
      toast({
        title: t('delete-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('delete-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <DeleteButton
      variant="command"
      description={t('delete-alert', { name })}
      isLoading={isPending}
      onClick={() => mutate(id)}
    />
  );
}
