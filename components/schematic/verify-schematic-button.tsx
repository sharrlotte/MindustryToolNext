import VerifyButton from '@/components/button/verify-button';
import Tran from '@/components/common/tran';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { verifySchematic } from '@/query/schematic';
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
export default function VerifySchematicButton({ id, name, selectedTags }: VerifySchematicButtonProps) {
  const { invalidateByKey } = useQueriesData();
  const { toast } = useToast();
  const { back } = useRouter();
  const axios = useClientApi();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: VerifySchematicRequest) => verifySchematic(axios, data),
    onSuccess: () => {
      back();
      toast({
        title: <Tran text="verify-success" />,
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: <Tran text="verify-fail" />,
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['schematics']);
    },
  });

  return (
    <VerifyButton
      description={<Tran text="verify-alert" args={{ name }} />}
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
