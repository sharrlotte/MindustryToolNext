'use client';

import React from 'react';

import Tran from '@/components/common/tran';

import { cva, VariantProps } from 'class-variance-authority';
import InternalLink from '@/components/common/internal-link';
import { PencilIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva('flex gap-1 p-2 rounded-sm', {
  variants: {
    variant: {
      default: 'border border-border',
      command: 'hover:bg-accent/80',
      ghost: 'border-none top-1 left-1 absolute',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type EditButtonProps = {
  href: string;
} & VariantProps<typeof buttonVariants>;
export default function EditButton({ href, variant }: EditButtonProps) {
  return (
    <InternalLink className={cn(buttonVariants({ variant }))} href={href}>
      <PencilIcon className="size-5" />
      <Tran text="edit" />
    </InternalLink>
  );
}
