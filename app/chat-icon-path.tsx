'use client';

import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { ChatIcon } from '@/components/common/icons';

import { useSocket } from '@/context/socket-context';
import useNotification from '@/hooks/use-notification';
import { cn, isError } from '@/lib/utils';

export function ChatIconPath() {
  const { socket } = useSocket();
  const { postNotification } = useNotification();
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [lastMessage] = useLocalStorage('LAST_MESSAGE_GLOBAL', '');

  useEffect(() => {
    try {
      socket
        .onRoom('GLOBAL')
        .await({ method: 'LAST_MESSAGE' })
        .then((newestMessage) => {
          if (isError(newestMessage)) {
            return;
          }

          setHasNewMessage(newestMessage && newestMessage.id !== lastMessage);
        });
    } catch (e) {
      console.error(e);
    }

    return socket.onRoom('GLOBAL').onMessage('MESSAGE', (message) => {
      if ('error' in message) {
        return;
      }

      postNotification(message.content, message.userId);
    });
  }, [socket, postNotification, lastMessage]);

  return (
    <div className="relative">
      <ChatIcon />
      <span className={cn('absolute -right-2 -top-2 hidden h-3 w-3 animate-ping rounded-full bg-red-500 opacity-75', { 'inline-flex': hasNewMessage })} />
      <span className={cn('absolute -right-2 -top-2 hidden h-3 w-3 rounded-full bg-red-500 opacity-75', { 'inline-flex ': hasNewMessage })} />
    </div>
  );
}
