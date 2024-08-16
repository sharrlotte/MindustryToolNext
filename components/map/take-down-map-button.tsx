'use client';

import TakeDownButton from '@/components/button/take-down-button';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import { unverifyMap } from '@/query/map';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type TakeDownMapButtonProps = {
  id: string;
  name: string;
};

export function TakeDownMapButton({
  id,
  name,
}: TakeDownMapButtonProps) {
  const axios = useClientAPI();
  const t = useI18n();
  const { back } = useRouter();
  const { invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    scope: {
      id,
    },
    mutationFn: (id: string) => unverifyMap(axios, id),
    onSuccess: () => {
      invalidateByKey(['maps']);
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
  });

  return (
    <TakeDownButton
      isLoading={isPending}
      description={t('take-down-alert', { name: name })}
      onClick={() => mutate(id)}
    />
  );
}