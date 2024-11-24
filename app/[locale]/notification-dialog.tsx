'use client';

import React, { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { Hidden } from '@/components/common/hidden';
import { IconNotification } from '@/components/common/icon-notification';
import { NotificationIcon } from '@/components/common/icons';
import InfinitePage from '@/components/common/infinite-page';
import Markdown from '@/components/common/markdown';
import { RelativeTime } from '@/components/common/relative-time';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EllipsisButton } from '@/components/ui/ellipsis-button';

import { useSession } from '@/context/session-context.client';
import { useSocket } from '@/context/socket-context';
import useClientApi from '@/hooks/use-client';
import useClientQuery from '@/hooks/use-client-query';
import useNotification from '@/hooks/use-notification';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import ProtectedElement from '@/layout/protected-element';
import { cn, isError } from '@/lib/utils';
import { deleteAllNotifications, deleteNotification, getMyNotifications, getMyUnreadNotificationCount, markAsRead, markAsReadById } from '@/query/notification';
import { Notification } from '@/types/response/Notification';
import { useNavBar } from '@/zustand/nav-bar-store';

import { useMutation } from '@tanstack/react-query';

export default function NotificationDialog() {
  const { session } = useSession();
  const { isVisible } = useNavBar();

  const isSmall = useMediaQuery('(max-width: 640px)');
  const expand = isSmall ? true : isVisible;

  return (
    <ProtectedElement session={session} filter>
      <Dialog>
        <DialogTrigger className={cn('flex items-center w-full flex-row col-span-full gap-2 justify-center hover:bg-brand rounded-md', { 'justify-start': expand, 'aspect-square': !expand })}>
          <NotificationDialogButton expand={expand} />
        </DialogTrigger>
        <DialogContent className="p-6 max-h-full flex flex-col" closeButton={false}>
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
          <NotificationContent />
          <DialogClose asChild>
            <Button className='ml-auto' variant="secondary">
              <Tran text="close" />
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </ProtectedElement>
  );
}

type NotificationDialogButtonProps = {
  expand: boolean;
};
function NotificationDialogButton({ expand }: NotificationDialogButtonProps) {
  const { socket } = useSocket();
  const { invalidateByKey } = useQueriesData();
  const { postNotification } = useNotification();

  let { data } = useClientQuery({
    queryKey: ['notifications', 'count'],
    queryFn: (axios) => getMyUnreadNotificationCount(axios),
  });

  data = data ?? 0;

  useEffect(
    () =>
      socket.onMessage('NOTIFICATION', (data) => {
        invalidateByKey(['notifications']);

        if (!isError(data)) {
          postNotification(data.title, 'SERVER');
        }
      }),
    [invalidateByKey, postNotification, socket],
  );

  return (
    <>
      <IconNotification number={data}>
        <NotificationIcon />
      </IconNotification>
      {expand && <Tran text="notification" />}
    </>
  );
}

function NotificationContent() {
  return (
    <ScrollContainer className="border-t">
      <InfinitePage className="gap-2 flex flex-col divide-y" queryKey={['notifications']} params={{ page: 0, size: 30 }} queryFn={getMyNotifications} noResult={<Tran text="notification.no-notification" />}>
        {(notification) => <NotificationCard key={notification.id} notification={notification} />}
      </InfinitePage>
    </ScrollContainer>
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
        <DialogContent className="p-4 overflow-y-auto max-h-full max-w-full w-fit min-w-[min(30rem,100%)] overflow-x-hidden">
          <DialogTitle className="font-bold text-2xl">{title}</DialogTitle>
          <DialogDescription />
          <Markdown className="text-muted-foreground">{content}</Markdown>
          <DialogFooter>
            <RelativeTime className="text-nowrap text-muted-foreground" date={new Date(createdAt)} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <EllipsisButton variant="icon">
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

  const { toast } = useToast();
  const { updateById, invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['notifications', 'mark-as-read'],
    mutationFn: () => markAsReadById(axios, id),
    onMutate: () => {
      updateById<Notification>(['notifications'], id, (prev) => ({ ...prev, read: true }));
    },
    onError: (error) => {
      toast({
        title: <Tran text="notification.mark-as-read-failed" />,
        content: error.message,
        variant: 'destructive',
      });
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

  const { toast } = useToast();
  const { filterByKey, invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['notifications', 'delete-notification'],
    mutationFn: () => deleteNotification(axios, id),
    onMutate: () => {
      filterByKey<Notification>(['notifications'], (prev) => prev.id !== id);
    },
    onError: (error) => {
      toast({
        title: <Tran text="notification.delete-failed" />,
        content: error.message,
        variant: 'destructive',
      });
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
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['notifications', 'delete-all'],
    mutationFn: () => deleteAllNotifications(axios),
    onSuccess: () => {
      toast({
        title: <Tran text="notification.delete-all-success" />,
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: <Tran text="notification.delete-all-failed" />,
        content: error.message,
        variant: 'destructive',
      });
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
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['notifications', 'mark-as-read-all'],
    mutationFn: () => markAsRead(axios),
    onSuccess: () => {
      toast({
        title: <Tran text="notification.mark-as-read-all-success" />,
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: <Tran text="notification.mark-as-read-all-failed" />,
        content: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['notifications']);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="min-w-20" variant='command' title="Delete">
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
