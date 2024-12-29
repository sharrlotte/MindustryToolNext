import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import IdUserCard from '@/components/user/id-user-card';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteDocument } from '@/query/document';
import { Document } from '@/types/response/Document';

import { useMutation } from '@tanstack/react-query';

type Props = {
  document: Document;
};

export default function DocumentCard({ document: { id, content, userId } }: Props) {
  const { invalidateByKey } = useQueriesData();

  const axios = useClientApi();
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteDocument(axios, id),
    onSuccess: () => {
      toast.success(<Tran text="delete-success" />);
    },
    onError: (error) => {
      toast.error(<Tran text="delete-fail" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['documents']);
    },
  });

  return (
    <Dialog>
      <DialogTrigger>
        <div className="space-y-2 text-start">
          <IdUserCard id={userId} />
          <p className="line-clamp-3">{content}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <ScrollContainer className="space-y-2">
          <IdUserCard id={userId} />
          <p>{content}</p>
        </ScrollContainer>
        <DeleteButton description={id} isLoading={isPending} onClick={() => mutate()}></DeleteButton>
      </DialogContent>
    </Dialog>
  );
}
