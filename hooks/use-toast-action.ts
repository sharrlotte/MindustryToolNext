import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

type UseToastActionParam<T> = {
  title: string;
  content: string;
  action: () => Promise<T>;
};

export default function useToastAction<T>({
  title,
  content,
  action,
}: UseToastActionParam<T>) {
  const { toast } = useToast();

  return useCallback(async () => {
    const { dismiss } = toast({
      title,
      content,
    });
    const result = await action();
    dismiss();
    return result;
  }, [toast, action, title, content]);
}
