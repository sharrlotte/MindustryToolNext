import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import IdUserCard from '@/components/user/id-user-card';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import deleteDocument from '@/query/documents/delete-document';
import { Document } from '@/types/response/Document';

import { useMutation } from '@tanstack/react-query';

type Props = {
  document: Document;
};

export default function DocumentCard({
  document: { id, content, authorId },
}: Props) {
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const t = useI18n();

  const axios = useClientAPI();
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteDocument(axios, id),
    onSuccess: () => {
      invalidateByKey(['documents']);
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
  });

  return (
    <Dialog>
      <DialogTrigger>
        <div className="space-y-2 text-start">
          <IdUserCard id={authorId} />
          <p className="line-clamp-3">{content}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-2 h-full overflow-y-auto">
          <IdUserCard id={authorId} />
          <p>{content}</p>
        </div>
        <DeleteButton
          description={id}
          isLoading={isPending}
          onClick={() => mutate()}
        ></DeleteButton>
      </DialogContent>
    </Dialog>
  );
}
