'use client';

import { Copy } from 'lucide-react';
import React from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import useClipboard from '@/hooks/use-clipboard';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/client';
import { cva, VariantProps } from 'class-variance-authority';
import { useMutation } from '@tanstack/react-query';

const copyButtonVariants = cva('p-2 hover:bg-brand bg-transparent', {
  variants: {
    variant: {
      default: 'border border-border',
      ghost: '',
    },
    position: {
      relative: '',
      absolute: 'absolute left-1 top-1 aspect-square',
    },
  },
  defaultVariants: {
    variant: 'default',
    position: 'relative',
  },
});

export type CopyButtonProps = VariantProps<typeof copyButtonVariants> &
  Omit<ButtonProps, 'title'> & {
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
  position,
  ...props
}: CopyButtonProps) {
  const t = useI18n();
  const copy = useClipboard();

  const { mutate } = useMutation({
    mutationFn: async () => (data instanceof Function ? await data() : data),
    onSuccess: (data) => {
      copy({ data, title, content });
    },
  });

  async function handleClick() {
    mutate();
  }

  return (
    <Button
      className={cn(copyButtonVariants({ className, variant, position }))}
      title={title ?? t('copy')}
      variant="ghost"
      {...props}
      onClick={handleClick}
    >
      {children ?? <Copy className="size-5 text-foreground" strokeWidth="1.3px" />}
    </Button>
  );
}
