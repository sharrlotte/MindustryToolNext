import { Copy } from 'lucide-react';
import React from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import useClipboard from '@/hooks/use-clipboard';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';

type CopyButtonProps = Omit<ButtonProps, 'title'> & {
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
  variant,
  ...props
}: CopyButtonProps) {
  const t = useI18n();
  const copy = useClipboard();

  async function handleClick() {
    const d = data instanceof Function ? await data() : data;

    copy({ data: d, title, content });
  }

  return (
    <Button
      className={cn('p-2 hover:bg-brand', className)}
      title={title ?? t('copy')}
      variant={variant}
      {...props}
      onClick={handleClick}
    >
      {children ?? <Copy className="h-5 w-5" strokeWidth="1.3px" />}
    </Button>
  );
}
