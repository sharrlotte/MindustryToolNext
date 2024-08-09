import VerifyButton from '@/components/button/verify-button';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import postVerifySchematic from '@/query/schematic/post-verify-schematic';
import VerifySchematicRequest from '@/types/request/VerifySchematicRequest';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';

type VerifySchematicButtonProps = {
  id: string;
  name: string;
  selectedTags: TagGroup[];
};
export default function VerifySchematicButton({
  id,
  name,
  selectedTags,
}: VerifySchematicButtonProps) {
  const { deleteById, invalidateByKey } = useQueriesData();
  const { toast } = useToast();
  const { back } = useRouter();
  const t = useI18n();
  const axios = useClientAPI();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: VerifySchematicRequest) =>
      postVerifySchematic(axios, data),
    onSuccess: () => {
      deleteById(['schematic'], id);
      invalidateByKey(['schematic']);
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
