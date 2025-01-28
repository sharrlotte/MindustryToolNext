'use client';

import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { useNavBar } from '@/app/[locale]/navigation';

import { IconNotification } from '@/components/common/icon-notification';
import { NotificationIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { useSession } from '@/context/session-context.client';
import { useSocket } from '@/context/socket-context';
import useClientQuery from '@/hooks/use-client-query';
import useNotification from '@/hooks/use-notification';
import useQueriesData from '@/hooks/use-queries-data';
import ProtectedElement from '@/layout/protected-element';
import { cn, isError } from '@/lib/utils';
import { getMyUnreadNotificationCount } from '@/query/notification';

const NotificationForm = dynamic(() => import('@/app/[locale]/notification-form'));

export default function NotificationDialog() {
  const { visible } = useNavBar();
  const { session } = useSession();

  const isSmall = useMediaQuery('(max-width: 640px)');
  const expand = isSmall ? true : visible;

  return (
    <Dialog>
      <DialogTrigger className={cn('flex items-center w-full flex-row col-span-full gap-2 justify-center hover:bg-brand rounded-md', { 'justify-start': expand, 'aspect-square': !expand })}>
        <NotificationDialogButton expand={expand} />
      </DialogTrigger>
      <DialogContent className="p-6 max-h-full flex flex-col" closeButton={false}>
        <ProtectedElement session={session} filter>
          <NotificationForm />
        </ProtectedElement>
      </DialogContent>
    </Dialog>
  );
}
type NotificationDialogButtonProps = {
  expand: boolean;
};
function NotificationDialogButton({ expand }: NotificationDialogButtonProps) {
  const { socket } = useSocket();
  const { state } = useSession();
  const { invalidateByKey } = useQueriesData();
  const { postNotification } = useNotification();

  const { data } = useClientQuery({
    queryKey: ['notifications', 'count'],
    queryFn: (axios) => getMyUnreadNotificationCount(axios),
    enabled: state === 'authenticated',
    placeholderData: 0,
  });

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
      <IconNotification number={data ?? 0}>
        <NotificationIcon />
      </IconNotification>
      {expand && <Tran text="notification" />}
    </>
  );
}
