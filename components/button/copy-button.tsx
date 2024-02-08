import { Button, ButtonProps } from '@/components/ui/button';
import useClipboard from '@/hooks/use-clipboard';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import React from 'react';

type CopyButtonProps = ButtonProps & {
  data: string | (() => Promise<string>);
  title?: string;
  content?: string;
};

export default function CopyButton({
  className,
  title,
  content,
  data,
  children,
  ...props
}: CopyButtonProps) {
  const copy = useClipboard();

  const handleCopy = async () => {
    let d = data instanceof Function ? await data() : data;

    copy({ data: d, title, content });
  };

  return (
    <Button
      className={cn('p-2', className)}
      title="Copy link"
      {...props}
      onClick={handleCopy}
    >
      {children ?? <Copy className="h-5 w-5" strokeWidth="1.3px" />}
    </Button>
  );
}
