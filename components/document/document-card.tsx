import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import Tran from '@/components/common/tran';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import IdUserCard from '@/components/user/id-user-card';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { deleteDocument } from '@/query/document';
import { Document } from '@/types/response/Document';

import { useMutation } from '@tanstack/react-query';

type Props = {
  document: Document;
};

export default function DocumentCard({ document: { id, content, userId } }: Props) {
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();

  const axios = useClientApi();
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteDocument(axios, id),
    onSuccess: () => {
      toast({
        title: <Tran text="delete-success" />,
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: <Tran text="delete-fail" />,
        description: error.message,
        variant: 'destructive',
      });
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
        <div className="h-full space-y-2 overflow-y-auto">
          <IdUserCard id={userId} />
          <p>{content}</p>
        </div>
        <DeleteButton description={id} isLoading={isPending} onClick={() => mutate()}></DeleteButton>
      </DialogContent>
    </Dialog>
  );
}
