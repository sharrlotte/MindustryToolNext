import { useSession } from '@/context/session-context';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/response/Message';
import { useCallback } from 'react';

export default function useNotification() {
  const { session } = useSession();
  const userId = session?.id;
  const { toast } = useToast();

  const processNotification = useCallback(
    (message: Message) => {
      if (message.userId === userId) return;

      new Notification(message.content);
    },
    [userId],
  );

  const postNotification = useCallback(
    (message: Message) => {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          return processNotification(message);
        }

        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            processNotification(message);
          } else {
            toast({
              title: <a href="/chat">{message.content}</a>,
            });
          }
        });
      } else {
        toast({
          title: <a href="/chat">{message.content}</a>,
        });
      }
    },
    [processNotification, toast],
  );

  return {
    postNotification,
  };
}
