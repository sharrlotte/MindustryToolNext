'use client';

import TakeDownButton from '@/components/button/take-down-button';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';
import { unverifySchematic } from '@/query/schematic';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type TakeDownSchematicButtonProps = {
  id: string;
  name: string;
};

export function TakeDownSchematicButton({
  id,
  name,
}: TakeDownSchematicButtonProps) {
  const axios = useClientApi();
  const t = useI18n();
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
        title: t('take-down-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('take-down-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['schematics']);
    },
  });

  return (
    <TakeDownButton
      isLoading={isPending}
      description={t('take-down-alert', { name })}
      onClick={() => mutate(id)}
    />
  );
}
