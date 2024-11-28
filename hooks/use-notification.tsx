import { useCallback } from 'react';
import { toast } from 'sonner';

import InternalLink from '@/components/common/internal-link';

import { useSession } from '@/context/session-context.client';

export default function useNotification() {
  const { session } = useSession();
  const userId = session?.id;

  const processNotification = useCallback(
    (message: string, sender: string, isGranted: boolean) => {
      if (sender === userId) return;

      if (isGranted) {
        new Notification(message, { body: message, icon: '/favicon.ico' });
      } else {
        toast(<InternalLink href="/chat">{message}</InternalLink>);
      }
    },
    [userId],
  );

  const postNotification = useCallback(
    async (message: string, sender: string) => {
      if ('Notification' in window) {
        if (Notification.permission !== 'granted') {
          await Notification.requestPermission();
        }

        processNotification(message, sender, Notification.permission === 'granted');
      } else {
        processNotification(message, sender, false);
      }
    },
    [processNotification],
  );

  return {
    postNotification,
  };
}
