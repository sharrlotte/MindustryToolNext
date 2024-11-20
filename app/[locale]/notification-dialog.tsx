import { BellIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { Hidden } from '@/components/common/hidden';
import { IconNotification } from '@/components/common/icon-notification';
import InfinitePage from '@/components/common/infinite-page';
import Markdown from '@/components/common/markdown';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { useSocket } from '@/context/socket-context';
import useClientQuery from '@/hooks/use-client-query';
import useNotification from '@/hooks/use-notification';
import useQueriesData from '@/hooks/use-queries-data';
import { cn, isError } from '@/lib/utils';
import { getMyNotifications, getMyUnreadNotificationCount } from '@/query/notification';
import { Notification } from '@/types/response/Notification';
import { useNavBar } from '@/zustand/nav-bar-store';

export default function NotificationDialog() {
  const { isVisible } = useNavBar();

  const isSmall = useMediaQuery('(max-width: 640px)');
  const expand = isSmall ? true : isVisible;

  return (
    <Dialog>
      <DialogTrigger className={cn('flex items-center w-full flex-row col-span-full gap-2 justify-center hover:bg-brand rounded-md', { 'justify-start': expand, 'aspect-square': !expand })}>
        <NotificationDialogButton expand={expand} />
      </DialogTrigger>
      <DialogContent className="p-6">
        <DialogTitle>
          <Tran text="notification" />
        </DialogTitle>
        <Hidden>
          <DialogDescription>This is a notification dialog.</DialogDescription>
        </Hidden>
        <NotificationContent />
      </DialogContent>
    </Dialog>
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
    [socket],
  );

  return (
    <>
      <IconNotification number={data}>
        <BellIcon className="size-5" />
      </IconNotification>
      {expand && <Tran text="notification" />}
    </>
  );
}

function NotificationContent() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <ScrollContainer ref={setContainer}>
      <InfinitePage
        className="gap-2 flex flex-col"
        queryKey={['notifications']}
        params={{ page: 0, size: 30 }}
        queryFn={getMyNotifications}
        container={() => container}
        noResult={<Tran text="notification.no-notification" />}
      >
        {(notification) => <NotificationCard key={notification.id} notification={notification} />}
      </InfinitePage>
    </ScrollContainer>
  );
}

type NotificationCardProps = {
  notification: Notification;
};

function NotificationCard({ notification: { title, content } }: NotificationCardProps) {
  return (
    <div className="p-2 bg-card rounded-md">
      <h1 className="text-xl font-bold">{title}</h1>
      <Markdown>{content}</Markdown>
    </div>
  );
}
