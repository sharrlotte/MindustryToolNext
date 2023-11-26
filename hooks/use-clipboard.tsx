import { useToast } from "@/hooks/use-toast";

type CopyProps = {
  data: string;
  title?: string;
  content?: string;
};

export default function useClipboard() {
  const { toast } = useToast();

  return async ({ data, title, content }: CopyProps) => {
    await navigator.clipboard.writeText(data);
    toast({
      title: title ?? "Copied",
      description: content ?? "Data has been copied to clipboard",
    });
  };
}
