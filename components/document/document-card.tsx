import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteDocument } from '@/query/document';
import { Document } from '@/types/response/Document';

import { useMutation } from '@tanstack/react-query';

type Props = {
  document: Document;
};

export default function DocumentCard({ document: { id, text, metadata } }: Props) {
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
    <div className="space-y-2 text-start">
      <p className="text-sx">{text}</p>
      <pre className="text-sx">{JSON.stringify(metadata, null, 2)}</pre>
      <DeleteButton description={id} isLoading={isPending} onClick={() => mutate()}></DeleteButton>
    </div>
  );
}
