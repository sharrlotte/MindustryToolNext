'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { revalidate } from '@/action/action';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteInternalServer } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type DeleteServerButtonProps = {
  id: string;
};

export function DeleteServerButton({ id }: DeleteServerButtonProps) {
  const axios = useClientApi();
  const router = useRouter();
  const { invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['servers'],
    mutationFn: () => deleteInternalServer(axios, id),
    onSuccess: () => {
      toast.success(<Tran text="delete-success" />);

      router.push('/servers');
    },
    onError: (error) => toast.error(<Tran text="delete-fail" />, { description: error.message }),
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
