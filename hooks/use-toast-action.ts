import { useToast } from '@/hooks/use-toast';
import { ReactNode, useCallback } from 'react';

type UseToastActionParam<T> = {
  title: ReactNode;
  content: ReactNode;
  action: () => Promise<T>;
};

export default function useToastAction<T>({ title, content, action }: UseToastActionParam<T>) {
  const { toast } = useToast();

  return useCallback(async () => {
    const { dismiss } = toast({
      title,
      description: content,
    });
    const result = await action();
    dismiss();
    return result;
  }, [toast, action, title, content]);
}
