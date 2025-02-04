import React from 'react';

import { Hidden } from '@/components/common/hidden';
import InfinitePage from '@/components/common/infinite-page';
import { RelativeTime } from '@/components/common/relative-time';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import Markdown from '@/components/markdown/markdown';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { cn } from '@/lib/utils';
import { deleteAllNotifications, deleteNotification, getMyNotifications, markAsRead, markAsReadById } from '@/query/notification';
import { PaginationQuerySchema } from '@/query/search-query';
import { Notification } from '@/types/response/Notification';

import { useMutation } from '@tanstack/react-query';

export default function NotificationForm() {
  return (
    <>
      <DialogTitle className="flex items-center justify-between w-full">
        <Tran className="text-2xl" text="notification" />
        <EllipsisButton variant="ghost">
          <MarkAsReadAllButton />
          <DeleteAllButton />
        </EllipsisButton>
      </DialogTitle>
      <Hidden>
        <DialogDescription>This is a notification dialog.</DialogDescription>
      </Hidden>
      <ScrollContainer className="border-t">
        <InfinitePage className="gap-2 flex flex-col divide-y" queryKey={['notifications']} paramSchema={PaginationQuerySchema} queryFn={getMyNotifications} noResult={<Tran text="notification.no-notification" />}>
          {(notification) => <NotificationCard key={notification.id} notification={notification} />}
        </InfinitePage>
      </ScrollContainer>
      <DialogClose asChild>
        <Button className="ml-auto" variant="secondary">
          <Tran text="close" />
        </Button>
      </DialogClose>
    </>
  );
}

type NotificationCardProps = {
  notification: Notification;
};

function NotificationCard({ notification }: NotificationCardProps) {
  const { title, content, read, createdAt } = notification;

  return (
    <div className="p-2 gap-2 cursor-pointer flex">
      <Dialog>
        <DialogTrigger asChild>
          <div className={cn('w-full text-ellipsis grid grid-cols-[0.5rem_auto] gap-2 items-baseline')}>
            {read ? <div></div> : <span className="size-2 bg-blue-400 rounded-full" />}
            <div className="overflow-hidden w-full">
              <h1 className="text-base font-bold">{title}</h1>
              <Markdown className="text-muted-foreground">{content}</Markdown>
              <RelativeTime className="text-nowrap text-muted-foreground" date={new Date(createdAt)} />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="h-full max-w-none flex w-full">
          <Hidden>
            <DialogDescription />
          </Hidden>
          <ScrollContainer className="p-4 max-h-full max-w-full flex flex-col w-full min-h-full min-w-[min(30rem,100%)]">
            <DialogTitle className="font-bold text-xl">{title}</DialogTitle>
            <Markdown className="text-muted-foreground">{content}</Markdown>
            <div className="mt-auto flex justify-between items-center">
              <RelativeTime className="text-nowrap text-muted-foreground" date={new Date(createdAt)} />
              <DialogClose asChild>
                <Button>
                  <Tran text="close" />
                </Button>
              </DialogClose>
            </div>
          </ScrollContainer>
        </DialogContent>
      </Dialog>
      <EllipsisButton variant="ghost">
        {!read && <MarkAsReadButton notification={notification} />}
        <DeleteButton notification={notification} />
      </EllipsisButton>
    </div>
  );
}

type MarkAsReadButtonProps = {
  notification: Notification;
};

function MarkAsReadButton({ notification }: MarkAsReadButtonProps) {
  const { id } = notification;

  const axios = useClientApi();

  const { updateById, invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['notifications', 'mark-as-read'],
    mutationFn: () => markAsReadById(axios, id),
    onMutate: () => {
      updateById<Notification>(['notifications'], id, (prev) => ({ ...prev, read: true }));
    },
    onError: (error) => {
      toast.error(<Tran text="notification.mark-as-read-failed" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['notifications']);
    },
  });

  return (
    <Button variant="command" disabled={isPending} onClick={() => mutate()}>
      <Tran text="notification.mark-as-read" />
    </Button>
  );
}

function DeleteButton({ notification }: MarkAsReadButtonProps) {
  const { id } = notification;

  const axios = useClientApi();

  const { filterByKey, invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['notifications', 'delete-notification'],
    mutationFn: () => deleteNotification(axios, id),
    onMutate: () => {
      filterByKey<Notification>(['notifications'], (prev) => prev.id !== id);
    },

    onError: (error) => {
      toast.error(<Tran text="notification.delete-failed" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['notifications']);
    },
  });

  return (
    <Button variant="command" disabled={isPending} onClick={() => mutate()}>
      <Tran text="notification.delete" />
    </Button>
  );
}

function DeleteAllButton() {
  const axios = useClientApi();

  const { invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['notifications', 'delete-all'],
    mutationFn: () => deleteAllNotifications(axios),
    onSuccess: () => {
      toast.success(<Tran text="notification.delete-all-success" />);
    },
    onError: (error) => {
      toast.error(<Tran text="notification.delete-all-failed" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['notifications']);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="min-w-20" title="Delete" variant="command-destructive">
          <Tran text="notification.delete-all" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Tran text="notification.delete-all-title" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Tran text="notification.delete-all-description" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Tran text="cancel" />
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isPending} onClick={() => mutate()}>
            <Tran text="delete" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function MarkAsReadAllButton() {
  const axios = useClientApi();

  const { invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['notifications', 'mark-as-read-all'],
    mutationFn: () => markAsRead(axios),
    onSuccess: () => {
      toast.success(<Tran text="notification.mark-as-read-all-success" />);
    },
    onError: (error) => {
      toast.error(<Tran text="notification.mark-as-read-all-failed" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['notifications']);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="min-w-20" variant="command" title="Delete">
          <Tran text="notification.mark-as-read-all" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Tran text="notification.mark-as-read-all-title" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Tran text="notification.mark-as-read-all-description" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Tran text="cancel" />
          </AlertDialogCancel>
          <AlertDialogAction variant="secondary" disabled={isPending} onClick={() => mutate()}>
            <Tran text="notification.mark-as-read-all" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
