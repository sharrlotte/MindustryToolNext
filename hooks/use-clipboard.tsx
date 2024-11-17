import { ReactNode, useCallback } from 'react';
import { text } from 'stream/consumers';

import Tran from '@/components/common/tran';
import { useToast } from '@/hooks/use-toast';

type CopyProps = {
  data: string;
  title?: ReactNode;
  content?: ReactNode;
};

let dismissLast: (() => void) | null = null;

export default function useClipboard() {
  const { toast } = useToast();

  return useCallback(
    async ({ data, title = <Tran text="copied" />, content = '' }: CopyProps) => {
      await navigator.clipboard.writeText(data);

      if (dismissLast) {
        dismissLast();
      }

      const { dismiss } = toast({
        title: title,
        description: content,
      });

      dismissLast = dismiss;

      return dismiss;
    },
    [toast],
  );
}
