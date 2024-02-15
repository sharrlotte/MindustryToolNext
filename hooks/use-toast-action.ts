import { useToast } from '@/hooks/use-toast';

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

  return async () => {
    const { dismiss } = toast({
      title,
      content,
    });
    const result = await action();
    dismiss();
    return result;
  };
}
