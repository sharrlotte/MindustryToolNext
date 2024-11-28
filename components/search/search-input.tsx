'use client';

import React, { HTMLAttributes } from 'react';

import { useI18n } from '@/i18n/client';
import { cn } from '@/lib/utils';

type SearchProps = HTMLAttributes<HTMLDivElement>;

export function SearchBar({ className, children, ...props }: SearchProps) {
  return (
    <div className={cn('flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-secondary px-2 shadow-md', className)} {...props}>
      {children}
    </div>
  );
}

type InputProps = HTMLAttributes<HTMLInputElement> & {
  value: string;
  placeholder: string;
};

export function SearchInput({ className, placeholder, ...props }: InputProps) {
  const t = useI18n();

  return <input className={cn('h-full w-full bg-transparent hover:outline-none focus:outline-none', className)} placeholder={t(placeholder)} {...props} />;
}

