'use client';

import { useSocket } from '@/context/socket-context';
import useClientApi from '@/hooks/use-client';
import useNotification from '@/hooks/use-notification';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function ClientInit() {
  const { socket } = useSocket();

  const axios = useClientApi();
  const { postNotification } = useNotification();

  useQuery({
    queryFn: () => axios.get('/ping?client=web'),
    queryKey: ['ping'],
  });

  useEffect(() => {
    socket
      .onRoom('GLOBAL')
      .onMessage('MESSAGE', (message) => postNotification(message));
  }, [socket, postNotification]);

  return undefined;
}
