'use client';

import { useSession } from '@/context/session-context';
import { useSocket } from '@/context/socket-context';
import useClientApi from '@/hooks/use-client';
import { Message } from '@/types/response/Message';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

export default function ClientInit() {
  const { session } = useSession();
  const { socket } = useSocket();

  const axios = useClientApi();

  useQuery({
    queryFn: () => axios.get('/ping?client=web'),
    queryKey: ['ping'],
  });

  const processNotification = useCallback(
    (message: Message) => {
      if (message.userId === session?.id) return;

      new Notification(message.content);
    },
    [session?.id],
  );

  const displayNotification = useCallback(
    (message: Message) => {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          return processNotification(message);
        }

        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            processNotification(message);
          }
        });
      }
    },
    [processNotification],
  );

  useEffect(() => {
    socket
      .onRoom('GLOBAL')
      .onMessage('MESSAGE', (message) => displayNotification(message));
  }, [socket, displayNotification]);

  return undefined;
}
