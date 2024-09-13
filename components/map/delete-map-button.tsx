'use client';

import DeleteButton, {
  DeleteButtonProps,
} from '@/components/button/delete-button';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';
import { deleteMap } from '@/query/map';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type DeleteMapButtonProps = {
  id: string;
  name: string;
  variant?: DeleteButtonProps['variant'];
};

export function DeleteMapButton({ id, name, variant }: DeleteMapButtonProps) {
  const axios = useClientApi();
  const t = useI18n();
  const { back } = useRouter();
  const { invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    scope: {
      id,
    },
    mutationFn: (id: string) => deleteMap(axios, id),
    onSuccess: () => {
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
    onSettled: () => {
      invalidateByKey(['maps']);
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
