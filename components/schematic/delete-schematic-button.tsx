'use client';

import DeleteButton, {
  DeleteButtonProps,
} from '@/components/button/delete-button';
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
  variant?: DeleteButtonProps['variant'];
};

export function DeleteSchematicButton({
  id,
  name,
  variant,
}: DeleteSchematicButtonProps) {
  const axios = useClientAPI();
  const t = useI18n();
  const { back } = useRouter();
  const {  invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    scope: {
      id,
    },
    mutationFn: (id: string) => deleteSchematic(axios, id),
    onSuccess: () => {
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
      variant={variant}
      description={t('delete-alert', { name })}
      isLoading={isPending}
      onClick={() => mutate(id)}
    />
  );
}
