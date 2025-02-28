'use client';

import { useRouter } from 'next/navigation';

import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

import { revalidate } from '@/action/action';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteServer } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type ServerSettingButtonProps = {
  id: string;
};

export function ServerSettingButton({ id }: ServerSettingButtonProps) {
  return (
    <div className="flex justify-end bg-card rounded-md gap-2 p-4">
      <TransferServerButton id={id} />
      <DeleteServerButton id={id} />
    </div>
  );
}

function DeleteServerButton({ id }: ServerSettingButtonProps) {
  const axios = useClientApi();
  const router = useRouter();
  const { invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['servers'],
    mutationFn: () => deleteServer(axios, id),
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
  );
}

function TransferServerButton({ id }: ServerSettingButtonProps) {
  const axios = useClientApi();
  const router = useRouter();
  const { invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['servers'],
    mutationFn: () => {
      // TODO: Implement transfer server logic here.
      return new Promise((resolve) => {
        resolve('This do nothing');
      });
    },
    onSuccess: () => {
      toast.success(<Tran text="transfer-success" />);

      router.push('/servers');
    },
    onError: (error) => toast.error(<Tran text="transfer-fail" />, { description: error.message }),
    onSettled: () => {
      revalidate({ path: '/servers' });
      invalidateByKey(['servers']);
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="min-w-20" title="transfer" variant="flat" disabled={isPending}>
          <Tran text="transfer" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Tran text="transfer-confirm" />
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Tran text="cancel" />
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button className="bg-destructive hover:bg-destructive" title="transfer" onClick={() => mutate()} disabled={isPending}>
              <Tran text="transfer" />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
