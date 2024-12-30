import { ReactNode, useCallback } from 'react';

import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

type CopyProps = {
  data: string;
  title?: ReactNode;
  content?: ReactNode;
};

let dismissLast: (() => void) | null = null;

export default function useClipboard() {
  return useCallback(async ({ data, title = <Tran text="copied" />, content = '' }: CopyProps) => {
    let id: string | number;

    async function copy() {
      await navigator.clipboard.writeText(data);

      if (dismissLast) {
        dismissLast();
      }

      id = toast(title, {
        description: content,
      });

      dismissLast = () => toast.dismiss(id);
    }

    copy();

    return () => toast.dismiss(id);
  }, []);
}
