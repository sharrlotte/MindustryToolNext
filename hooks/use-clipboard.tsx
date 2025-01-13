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
    if (dismissLast) {
      dismissLast();
    }

    const id = await toast.promise(navigator.clipboard.writeText(data), {
      success: () => ({ title, description: content }),
    });

    dismissLast = () => toast.dismiss(id);

    return () => toast.dismiss(id);
  }, []);
}
