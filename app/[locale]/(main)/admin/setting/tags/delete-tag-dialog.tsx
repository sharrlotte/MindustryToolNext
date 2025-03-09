import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import Tran from '@/components/common/tran';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteTag } from '@/query/tag';
import { TagDto } from '@/types/response/Tag';

import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';

type Props = {
  tag: TagDto;
};

export default function DeleteTagDialog({ tag }: Props) {
  const { id, name } = tag;

  const axios = useClientApi();
  const { invalidateByKey } = useQueriesData();
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteTag(axios, id),
    onSuccess: () => {
      toast.success(<Tran text="delete-success" />);
    },
    onError: (error) => {
      toast.error(<Tran text="delete-fail" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['tags-detail']);
    },
  });

  return <DeleteButton isLoading={isPending} description={<Tran text="tags.delete-confirm" args={{ name }} />} onClick={mutate} variant="command" />;
}
