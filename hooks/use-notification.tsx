import { useCallback } from 'react';

import { useSession } from '@/context/session-context.client';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/response/Message';

export default function useNotification() {
  const { session } = useSession();
  const userId = session?.id;
  const { toast } = useToast();

  const processNotification = useCallback(
    (message: Message, isGranted: boolean) => {
      if (message.userId === userId) return;

      if (isGranted) {
        new Notification(message.content);
      } else {
        toast({
          title: <a href="/chat">{message.content}</a>,
        });
      }
    },
    [userId, toast],
  );

  const postNotification = useCallback(
    async (message: Message) => {
      if ('Notification' in window) {
        if (Notification.permission !== 'granted') {
          await Notification.requestPermission();
        }

        processNotification(message, Notification.permission === 'granted');
      } else {
        processNotification(message, false);
      }
    },
    [processNotification],
  );

  return {
    postNotification,
  };
}
