'use client';

import { useRouter } from 'next/navigation';

import { revalidate } from '@/action/action';
import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { deleteInternalServer } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type DeleteServerButtonProps = {
  id: string;
};

export function DeleteServerButton({ id }: DeleteServerButtonProps) {
  const axios = useClientApi();
  const router = useRouter();
  const { invalidateByKey } = useQueriesData();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationKey: ['servers'],
    mutationFn: () => deleteInternalServer(axios, id),
    onSuccess: () => {
      toast({
        title: <Tran text="delete-success" />,
        variant: 'success',
      });
      router.push('/servers');
    },
    onError: (error) =>
      toast({
        title: <Tran text="delete-fail" />,
        description: error.message,
        variant: 'destructive',
      }),
    onSettled: () => {
      revalidate({ path: '/servers' });
      invalidateByKey(['servers']);
    },
  });
  return (
    <div className="flex justify-end bg-card p-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="min-w-20" title="Delete" variant="destructive" disabled={isPending}>
            <Tran text="delete" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <Tran text="delete-confirm" />
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Tran text="cancel" />
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button className="bg-destructive hover:bg-destructive" title="delete" onClick={() => mutate()} disabled={isPending}>
                <Tran text="delete" />
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
