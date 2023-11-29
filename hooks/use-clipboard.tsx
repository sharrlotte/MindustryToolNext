import { useToast } from "@/hooks/use-toast";

type CopyProps = {
  data: string;
  title?: string;
  content?: string;
};

let dismissLast: (() => void) | null = null;

export default function useClipboard() {
  const { toast } = useToast();

  return async ({ data, title, content }: CopyProps) => {
    await navigator.clipboard.writeText(data);
    if (dismissLast) dismissLast();
    const { dismiss } = toast({
      title: title ?? "Copied",
      description: content ?? "Data has been copied to clipboard",
    });
    dismissLast = dismiss;
    return dismiss
  };
}
