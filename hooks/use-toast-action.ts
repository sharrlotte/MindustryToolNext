import { ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

type UseToastActionParam<T> = {
  title: ReactNode;
  content: ReactNode;
  action: () => Promise<T>;
};

export default function useToastAction<T>({ title, content, action }: UseToastActionParam<T>) {
  return useCallback(async () => {
    const id = toast(title, { description: content });
    const result = await action();
    toast.dismiss(id);
    return result;
  }, [action, title, content]);
}
