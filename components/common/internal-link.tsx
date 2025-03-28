'use client';

import { VariantProps, cva } from 'class-variance-authority';
import Link from 'next/link';
import React from 'react';

import env from '@/constant/env';
import { cn } from '@/lib/utils';

const linkVariants = cva('flex gap-2', {
  variants: {
    variant: {
      default: '',
      primary: 'text-brand hover:text-brand',
      'button-primary': 'rounded-sm border bg-brand p-2 text-sm text-brand-foreground border-brand',
      'button-secondary': 'items-center flex gap-2 rounded-sm bg-secondary px-2 py-1.5',
      command: 'hover:bg-accent justify-start gap-1 flex items-center p-2 w-full rounded-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type InternalLinkVariants = VariantProps<typeof linkVariants>;

export type InternalLinkProps = React.ButtonHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof linkVariants> & {
    asChild?: boolean;
  } & {
    href: string;
  };

export default function InternalLink({ className, variant, title, href, children, ...props }: InternalLinkProps) {
  if (href.startsWith('http') && !href.startsWith(env.url.base)) {
    return (
      <a className={cn(linkVariants({ variant, className }))} {...props} href={href} title={title} target="_blank">
        {children}
      </a>
    );
  }

  return (
    <Link className={cn(linkVariants({ variant, className }))} {...props} href={href} title={title}>
      {children}
    </Link>
  );
}
