import VerifyButton from '@/components/button/verify-button';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import { verifyMap } from '@/query/map';
import VerifyMapRequest from '@/types/request/VerifyMapRequest';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';

type VerifyMapButtonProps = {
  id: string;
  name: string;
  selectedTags: TagGroup[];
};
export default function VerifyMapButton({
  id,
  name,
  selectedTags,
}: VerifyMapButtonProps) {
  const { invalidateByKey } = useQueriesData();
  const { toast } = useToast();
  const { back } = useRouter();
  const t = useI18n();
  const axios = useClientApi();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: VerifyMapRequest) => verifyMap(axios, data),
    onSuccess: () => {
      invalidateByKey(['maps']);
      back();
      toast({
        title: t('verify-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('verify-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <VerifyButton
      description={`${t('verify')} ${name}`}
      isLoading={isPending}
      onClick={() =>
        mutate({
          id: id,
          tags: TagGroups.toStringArray(selectedTags),
        })
      }
    />
  );
}
