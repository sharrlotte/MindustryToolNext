import { ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

import Tran from '@/components/common/tran';

type CopyProps = {
  data: string;
  title?: ReactNode;
  content?: ReactNode;
};

let dismissLast: (() => void) | null = null;

export default function useClipboard() {
  return useCallback(async ({ data, title = <Tran text="copied" />, content = '' }: CopyProps) => {
    await navigator.clipboard.writeText(data);

    if (dismissLast) {
      dismissLast();
    }

    const id = toast(title, {
      description: content,
    });

    dismissLast = () => toast.dismiss(id);

    return () => toast.dismiss(id);
  }, []);
}
